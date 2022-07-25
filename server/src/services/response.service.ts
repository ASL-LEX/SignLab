import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResponseUpload,
  ResponseUploadDocument,
} from '../schemas/response-upload.schema';
import { Model } from 'mongoose';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { Response, ResponseDocument } from '../schemas/response.schema';
import { SaveAttempt } from '../../../shared/dtos/response.dto';
import { User } from '../schemas/user.schema';
import { Study } from '../schemas/study.schema';
import { StudyService } from './study.service';
import { TagService } from './tag.service';
import { Tag } from '../schemas/tag.schema';

const csv = require('csv-parser');
const unzipper = require('unzipper');

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(ResponseUpload.name)
    private responseUploadModel: Model<ResponseUploadDocument>,
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    private studyService: StudyService,
    private tagService: TagService
  ) {}

  /**
   * Assign the given user to tag the next untagged response for the given
   * study. This will return the response that the user has to tag if a
   * response is available, if no response is left untagged, then null is
   * returned.
   *
   * If the user is already assigned a tag they have not completed, the
   * incomplete tag is returned
   *
   * @param user The user to assign a response to tag
   * @param study The study that the user is tagging for
   * @return An object with the incomplete tag for the user to complete
   */
  async assignResponse(user: User, study: Study): Promise<Tag | null> {
    // First check for an incomplete tag
    const incompleteTag = await this.tagService.getIncompleteTag(user, study);
    if (incompleteTag) {
      return incompleteTag;
    }

    // Look up the next response in the study that doesn't have a tag yet and
    // is enabled
    const query = {
      enabled: true
    };
    query[`hasTag.${study._id}`] = false;

    // Mark the response as having a tag so other users don't attempt to
    // tag the same response
    const update = {
      hasTag: { [study._id!]: true }
    };

    const response = await this.responseModel.findOneAndUpdate(query, update).exec();

    // No remaining untagged responses for this study
    if(!response) {
      return null;
    }

    // Make a tag for the response
    const tag = await this.tagService.createTag(user, response, study);

    return tag;
  }

  /**
   * Save the give tag for the response. Will first validate the `info`
   * associated with the tag to ensure it matches the expected schema.
   */
  async addTag(tag: Tag) {
    // First ensure the tag matches the expected schema
    const validationResult = this.studyService.validate(tag);
    if (validationResult.errors.length > 0) {
      throw validationResult.errors;
    }

    // If the tag is valid, make as completed and save
    tag.complete = true;
    this.tagService.save(tag);
  }

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
              { place: `Line ${lineNumber}`, message: saveResult.message },
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
  async uploadResponseVideos(zipFile: string): Promise<SaveAttempt> {
    // Unzip the folder
    await createReadStream(zipFile).pipe(
      unzipper.Extract({ path: './upload/responses' }),
    );

    const filesMissingData = []; // Files that don't have cooresponding ResponseUploads

    // Go through each file and find the cooresponding ResponseUpload
    const files = await readdir('./upload/responses/');

    // Get the IDs of all studys for constructing the map of responses to
    // having a tag.
    // This will generate the mapping between study IDs and the response
    // having a tag for that study. When the response is first created it
    // won't have an tag for any study, so the result will look something like
    // {
    //    'some MongoDB ID 1': false,
    //    'some MongoDB ID 2': false,
    //    'some MongoDB ID 3': false,
    // }
    // NOTE: This assumes that no new study will be made as responses are
    //       being uploaded
    const studies = await this.studyService.getStudies();
    const studyMapping = new Map<string, boolean>(studies.map(study => [ study._id, false]));

    let count = 0;
    for (const file of files) {
      const filePath = join('./upload/response', file);

      // Ignore gitkeep
      if (file === '.gitkeep') {
        continue;
      }
      count += 1;

      // Search for cooresponding ResponseUpload
      const saveResult = await this.saveResponse(file, filePath, studyMapping);
      if (saveResult.type == 'warning') {
        filesMissingData.push(file);
        continue;
      }
    }

    // No files found, return a warning
    if (count == 0) {
      return {
        type: 'warning',
        message: 'No response videos found in ZIP, no responses saved',
      };
    }

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

    return result;
  }

  /**
   * Get all responses from the database
   */
  async getAllResponses(): Promise<Response[]> {
    return await this.responseModel.find({}).exec();
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
   * @param studyMapping The IDs for each study which need to be included when
   *        making a response.
   */
  private async saveResponse(
    filename: string,
    _filePath: string,
    studyMapping: Map<string, boolean>
  ): Promise<SaveAttempt> {
    // Try to find a cooresponding ResponseUpload based on filename
    const responseUpload = await this.responseUploadModel
      .findOne({ filename: filename })
      .exec();
    if (!responseUpload) {
      return {
        type: 'warning',
        message: `Response upload not found for ${filename}`,
      };
    }

    // Make a response entity
    // TODO: Determine duration or have default on error
    // TODO: Replace video URL with location in bucket storage
    const response: Response = {
      responseID: responseUpload.responseID,
      videoURL: `/media/${filename}`,
      recordedInSignLab: false,
      responderID: responseUpload.responderID,
      enabled: true,
      meta: responseUpload.meta,
      hasTag: studyMapping
    };
    await this.responseModel.create(response);

    // Remove the ResponseUpload entity
    this.responseUploadModel.deleteOne({
      responseID: responseUpload.responseID,
    });

    // Success
    return { type: 'success' };
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
    if (await this.responseExists(responseUpload.responseID)) {
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
    } catch (error) {
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

  /**
   * Check to see if the there is already a response with the given responseID
   * either in the ResponseUploads or the Responses
   *
   * @param responseID The responseID to search for
   * @return True if the responseID is present in ResponseUploads or Responses
   */
  private async responseExists(responseID: string) {
    // First check response uploads
    const responseUpload = await this.responseUploadModel
      .findOne({ responseID: responseID })
      .exec();
    if (responseUpload) {
      return true;
    }

    // Then check responses
    const response = await this.responseModel
      .findOne({ responseID: responseID })
      .exec();
    return response != null;
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

}
