import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResponseUpload,
  ResponseUploadDocument,
} from '../schemas/response-upload.schema';
import { ResponseService } from './response.service';
import { Model } from 'mongoose';
import { Readable } from 'stream';
import { SaveAttempt } from 'shared/dtos/response.dto';
import { createReadStream } from 'fs';
import { readdir, unlink } from 'fs/promises';
import { join, basename } from 'path';
import { Response } from '../schemas/response.schema';
import { BucketStorage } from './bucket/bucket.service';

const csv = require('csv-parser');
const unzipper = require('unzipper');

/**
 * The upload result includes any error messages that may have taken place
 * during the upload as well as an array of responses that was created
 * during the upload.
 */
export interface ResponseUploadResult {
  responses: Response[];
  saveResult: SaveAttempt;
}

@Injectable()
export class ResponseUploadService {
  constructor(
    @InjectModel(ResponseUpload.name)
    private responseUploadModel: Model<ResponseUploadDocument>,
    private responseService: ResponseService,
    private bucketService: BucketStorage,
  ) {}

  /**
   * Handle the process of taking a stream of data and attempting to parse
   * that data as a CSV. The CSV should contain information related to series
   * of responses being uploaded.
   */
  async uploadResponseDataCSV(stream: Readable): Promise<SaveAttempt> {
    // Clear out any left over ResponseUploads
    // TODO: May want some way of alerting the user that there are any
    //       remaining response uploads
    await this.responseUploadModel.deleteMany({}).exec();

    // Loop over all rows and attempt to parse the ResponseUploads out
    let lineNumber = 2; // Ignore header which must always be present
    try {
      const parser = stream.pipe(csv({ strict: true }));
      for await (const row of parser) {
        // Turn the data from a flat row format into an object with
        // seperate meta data component
        const transformed = this.transformRow(row);

        // Try to save this row
        const saveResult = await this.responseUploadSave(transformed);
        if (saveResult.type == 'error') {
          return {
            type: 'error',
            message:
              'Error found in the CSV, please fix the error and reupload the CSV',
            where: [
              {
                place: `Line ${lineNumber}`,
                message: saveResult.message ? saveResult.message : '',
              },
            ],
          };
        }

        lineNumber += 1;
      }
    } catch (error: any) {
      // Error related to the CSV parsing
      return {
        type: 'error',
        message: `Failed to parse CSV with message "${error.message}" on line ${lineNumber}`,
      };
    }

    // If no data has been processed, throw an error
    if (lineNumber == 2) {
      return {
        type: 'error',
        message: `No responses found in CSV, ensure there is at least one line
                  of data not including the required header`,
      };
    }

    // Success
    return { type: 'success' };
  }

  /**
   * Handles saving the video responses into the bucket and creating the
   * Responses from the ResponseUploads
   *
   * @param zipFile Path to the zip file containing the videos
   */
  async uploadResponseVideos(zipFile: string): Promise<ResponseUploadResult> {
    // Unzip the folder
    await new Promise<void>((resolve, _reject) => {
      createReadStream(zipFile)
        .pipe(
          unzipper.Extract({ path: './upload/responses' }),
        )
        .on('finish', () => { resolve(); });
    });

    const filesMissingData = []; // Files that don't have cooresponding ResponseUploads

    // Go through each file and find the cooresponding ResponseUpload
    const files = await readdir('./upload/responses/');

    const responsesCreated: Response[] = [];

    let count = 0;
    for (const file of files) {
      const filePath = join('./upload/responses', file);

      // Ignore gitkeep
      if (file === '.gitkeep') {
        continue;
      }
      count += 1;

      // Search for cooresponding ResponseUpload
      const saveResult = await this.saveResponse(file, filePath);
      if (saveResult.saveResult.type == 'warning') {
        console.log(saveResult);
        filesMissingData.push(file);
        continue;
      }
      if (saveResult.responses) {
        responsesCreated.push(saveResult.responses[0]);
      }
    }

    // No files found, return a warning
    if (count == 0) {
      return {
        responses: [],
        saveResult: {
          type: 'warning',
          message: 'No response videos found in ZIP, no responses saved',
        },
      };
    }

    // Delete the files after handling upload
    await Promise.all(files.map(file => {
      return unlink(join('./upload/responses', file));
    }));

    const result: SaveAttempt = {
      type: 'success',
    };

    // If some files did not have ResonseUploads, collect that info in
    // a warning
    if (filesMissingData.length > 0) {
      result.type = 'warning';
      result.message = `File(s) were included in the upload that did not have
                        a cooresponding row in the CSV, upload a new CSV with
                        the missing information and a new ZIP with just the
                        files that had the missing information to include
                        those responses in the system`;
      result.where = [];

      for (const file of filesMissingData) {
        result.where.push({
          place: `${file}`,
          message: 'Could not find information in CSV',
        });
      }
    }

    return {
      responses: responsesCreated,
      saveResult: result,
    };
  }

  /**
   * Attempt to make a Response entity for the given file. This will do
   * the following
   *
   * 1. Try to find a cooresponding ResponseUpload based on filename
   * 2. Make a Response entity based on the ResponseUpload and file
   * 3. Upload the file to bucket storage
   * 4. Remove the ResponseUpload entity
   *
   * Will return a warning if a ResponseUpload is not found.
   *
   * @param filename The name of the file of the video
   * @param _filePath The path to the file including the name
   */
  private async saveResponse(
    filename: string,
    _filePath: string,
  ): Promise<ResponseUploadResult> {
    // Try to find a cooresponding ResponseUpload based on filename
    const responseUpload = await this.responseUploadModel
      .findOne({ filename: filename })
      .exec();
    if (!responseUpload) {
      return {
        responses: [],
        saveResult: {
          type: 'warning',
          message: `Response upload not found for ${filename}`,
        },
      };
    }

    // Move the file into the bucket
    const uploadResult = await this.bucketService.objectUpload(
      `upload/responses/${responseUpload.filename}`,
      `Responses/${basename(responseUpload.filename)}`,
    );

    // Make a response entity
    // TODO: Determine duration or have default on error
    // TODO: Replace video URL with location in bucket storage
    const newResponse: Response = {
      responseID: responseUpload.responseID,
      videoURL: uploadResult.uri,
      recordedInSignLab: false,
      responderID: responseUpload.responderID,
      meta: responseUpload.meta,
    };
    const response = await this.responseService.createResponse(newResponse);

    // Remove the ResponseUpload entity
    this.responseUploadModel.deleteOne({
      responseID: responseUpload.responseID,
    });

    // Success
    return {
      responses: [response],
      saveResult: {
        type: 'success',
      },
    };
  }

  /**
   * Try to save the new ResponseUpload, this will first validate that the
   * ResponseUpload meets the following requirements
   *
   * 1. The format of the response matches the required schema
   * 2. The responseID is unique and not found in existing ResponseUploads
   *    nor in regular Responses
   *
   * @return The result of attempting to save, if there is an error, a human
   *         readable error field will be present in the result
   */
  private async responseUploadSave(
    responseUpload: ResponseUpload,
  ): Promise<SaveAttempt> {
    // Make sure the schema matches the expectation
    const schemaResult = await this.validateSchema(responseUpload);

    if (schemaResult.type == 'error') {
      return schemaResult;
    }

    // Trim required fields
    responseUpload.responderID = responseUpload.responderID.trim();
    responseUpload.responseID = responseUpload.responseID.trim();
    responseUpload.filename = responseUpload.filename.trim();

    // Make sure the ResponseUpload ID is unique
    const responseExists =
      (await this.responseService.responseExists(responseUpload.responseID)) ||
      (await this.responseUploadExists(responseUpload.responseID));
    if (responseExists) {
      return {
        type: 'error',
        message: `Response with ID ${responseUpload.responseID} already exists`,
      };
    }

    // Otherwise, save the new response upload
    this.responseUploadModel.create(responseUpload);
    return { type: 'success' };
  }

  /**
   * Attempts to transform the flat row of the CSV into the format of
   * a ResponseUpload. This will work by taking all required fields
   * and placing them at the root level of the object, then placing all
   * other fields and placing them within the metadata field.
   *
   * NOTE: This does not handle any schema validation, this only puts the
   *       data into the expected format.
   *
   * @param row The row to transform
   * @return The transformed ResponseUpload
   */
  private transformRow(row: any): ResponseUpload {
    const transformed = {
      responseID: row.responseID,
      responderID: row.responderID,
      filename: row.filename,
      meta: {},
    };

    delete row.responseID;
    delete row.responderID;
    delete row.filename;

    transformed.meta = { ...row };

    return transformed;
  }

  private async responseUploadExists(responseID: string): Promise<boolean> {
    const responseUpload = await this.responseUploadModel
      .findOne({ responseID: responseID })
      .exec();
    return responseUpload != null;
  }

  /**
   * Attempt to validate the object as a ResponseUpload. On failure will
   * grab the errors in a human readable format.
   *
   * This calls the validation method through the Mongoose schema.
   *
   * @param obj The object to try to verify as a ResponseUpload
   * @return SaveAttempt with the error field populated if an error has taken
   *         place
   */
  private async validateSchema(obj: any): Promise<SaveAttempt> {
    try {
      await this.responseUploadModel.validate(obj);
      // Validate ran successfully, return no errors
      return { type: 'success' };
    } catch (error: any) {
      // Parse out the errors into a human readable format
      let errorMessage = '';
      for (const validationError in error.errors) {
        errorMessage += `${error.errors[validationError].properties.message}\n`;
      }

      return {
        type: 'error',
        message: errorMessage,
      };
    }
  }
}
