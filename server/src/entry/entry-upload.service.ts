import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntryUpload, EntryUploadDocument } from './entry-upload.schema';
import { EntryService } from './entry.service';
import { Model } from 'mongoose';
import { Readable } from 'stream';
import { SaveAttempt } from 'shared/dtos/entry.dto';
import { createReadStream } from 'fs';
import { readdir, rm, stat } from 'fs/promises';
import { join } from 'path';
import { Entry } from './entry.schema';
import { BucketStorage } from '../bucket/bucket.service';
import { ConfigService } from '@nestjs/config';
import { Dataset } from 'shared/dtos/dataset.dto';
import { User } from 'shared/dtos/user.dto';

const csv = require('csv-parser');
const unzipper = require('unzipper');

/**
 * The upload result includes any error messages that may have taken place
 * during the upload as well as an array of entries that was created
 * during the upload.
 */
export interface EntryUploadResult {
  entries: Entry[];
  saveResult: SaveAttempt;
}

@Injectable()
export class EntryUploadService {
  private supportedVideoFormats: Set<string>;
  /**
   * The dataset that is being uploaded to.
   *
   * NOTE: This will be fine for supporting a single user making an upload
   * at a time, but not ideal for larger use cases. In the future seperate
   * sessions should exists to support multiple users uploading at a time
   */
  private dataset: Dataset | null = null;
  private user: User | null = null;

  constructor(
    @InjectModel(EntryUpload.name)
    private entryUploadModel: Model<EntryUploadDocument>,
    private entryService: EntryService,
    private bucketService: BucketStorage,
    configService: ConfigService,
  ) {
    this.supportedVideoFormats = new Set<string>(
      configService.getOrThrow<string[]>('videoSettings.supportedTypes'),
    );
  }

  setTargetDataset(dataset: Dataset) {
    this.dataset = dataset;
  }

  setTargetUser(user: User) {
    this.user = user;
  }

  /**
   * Handle the process of taking a stream of data and attempting to parse
   * that data as a CSV. The CSV should contain information related to series
   * of entries being uploaded.
   */
  async uploadEntryDataCSV(stream: Readable): Promise<SaveAttempt> {
    // Clear out any left over EntryUploads
    // TODO: May want some way of alerting the user that there are any
    //       remaining entry uploads
    await this.entryUploadModel.deleteMany({}).exec();

    // Loop over all rows and attempt to parse the EntryUploads out
    let lineNumber = 2; // Ignore header which must always be present
    try {
      const parser = stream.pipe(csv({ strict: true }));
      for await (const row of parser) {
        // Turn the data from a flat row format into an object with
        // seperate meta data component
        const transformed = this.transformRow(row);

        // Try to save this row
        const saveResult = await this.entryUploadSave(transformed);
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
        message: `No entries found in CSV, ensure there is at least one line
                  of data not including the required header`,
      };
    }

    // Success
    return { type: 'success' };
  }

  /**
   * Handles saving the video entries into the bucket and creating the
   * Entries from the EntryUploads
   *
   * @param zipFile Path to the zip file containing the videos
   */
  async uploadEntryVideos(zipFile: string): Promise<EntryUploadResult> {
    // Extract the zip
    const unzipResult = await this.extractZIP(zipFile);
    if (unzipResult.type == 'error') {
      return { entries: [], saveResult: unzipResult };
    }

    // Warning that were generated when uploading the files
    const fileWarnings: SaveAttempt[] = [];

    // Go through each file and find the cooresponding EntryUpload
    const files = await readdir('./upload/entries/');

    const entriesCreated: Entry[] = [];

    let count = 0;
    for (const file of files) {
      const filePath = join('./upload/entries', file);

      // Ignore gitkeep
      if (file === '.gitkeep') {
        continue;
      }

      // Ignore directories
      const fileStats = await stat(filePath);
      if (fileStats.isDirectory()) {
        continue;
      }

      count += 1;

      // Check the file type based on the extension
      const fileExtension = file.slice(file.lastIndexOf('.') + 1);
      if (!this.supportedVideoFormats.has(fileExtension)) {
        console.warn(`Unsupported file type uploaded: ${fileExtension}`);

        fileWarnings.push({
          type: 'warning',
          message: `File has unsupported type "${fileExtension}", supported formats ${Array.from(
            this.supportedVideoFormats,
          ).join(', ')}`,
          where: [{ place: `${file}`, message: 'Invalid extension' }],
        });

        continue;
      }

      // Attempt to save the entry based on the filename
      const entryUploadResult = await this.saveEntry(file, filePath);
      if (entryUploadResult.saveResult.type == 'warning') {
        fileWarnings.push(entryUploadResult.saveResult);
        continue;
      }
      if (entryUploadResult.entries) {
        entriesCreated.push(entryUploadResult.entries[0]);
      }
    }

    // No files found, return a warning
    if (count == 0) {
      return {
        entries: [],
        saveResult: {
          type: 'warning',
          message: 'No entry videos found in ZIP, no entries saved',
        },
      };
    }

    // Delete the files after handling upload
    await Promise.all(
      files.map((file) => {
        return rm(join('./upload/entries', file), {
          recursive: true,
          force: true,
        });
      }),
    );

    // Get the entry-uploads that were found in the CSV, but not in the zip.
    // Since the entry uploads are deleted as entries are made, all remaining
    // entry uploads are those that were not found in the zip
    const entryUploads = await this.entryUploadModel.find({}).exec();
    for (const entryUpload of entryUploads) {
      fileWarnings.push({
        type: 'warning',
        message: `Entry not found in ZIP, entry not saved`,
        where: [{ place: `${entryUpload.filename}`, message: '' }],
      });
    }

    const result: SaveAttempt = {
      type: 'success',
    };

    // Collect all of the warnings generated
    if (fileWarnings.length > 0) {
      result.type = 'warning';
      result.message = 'Uploading video files caused warnings';
      result.where = [];

      for (const warning of fileWarnings) {
        const place = warning.where ? warning.where[0].place : '';
        result.where.push({
          message: warning.message || '',
          place: place,
        });
      }
    }

    return {
      entries: entriesCreated,
      saveResult: result,
    };
  }

  /**
   * Attempt to make a Entry entity for the given file. This will do
   * the following
   *
   * 1. Try to find a cooresponding EntryUpload based on filename
   * 2. Make a Entry entity based on the EntryUpload and file
   * 3. Upload the file to bucket storage
   * 4. Remove the EntryUpload entity
   *
   * Will return a warning if a EntryUpload is not found.
   *
   * @param filename The name of the file of the video
   * @param _filePath The path to the file including the name
   */
  private async saveEntry(
    filename: string,
    _filePath: string,
  ): Promise<EntryUploadResult> {
    // Try to find a cooresponding EntryUpload based on filename
    const entryUpload = await this.entryUploadModel
      .findOne({ filename: filename })
      .exec();
    if (!entryUpload) {
      return {
        entries: [],
        saveResult: {
          type: 'warning',
          message: `Entry for file ${filename} was not found in original CSV`,
          where: [
            {
              place: `${filename}`,
              message: 'Entry upload not found',
            },
          ],
        },
      };
    }

    // Make a entry entity
    // TODO: Determine duration or have default on error
    const newEntry: Entry = {
      entryID: entryUpload.entryID,
      videoURL: 'placeholder',
      recordedInSignLab: false,
      meta: entryUpload.meta,
      dataset: this.dataset!,
      creator: this.user!,
      dateCreated: new Date(),
    };
    const entry = await this.entryService.createEntry(newEntry);

    // Move the file into the bucket
    const fileExtension = filename.slice(filename.lastIndexOf('.') + 1);
    const uploadResult = await this.bucketService.objectUpload(
      `upload/entries/${entryUpload.filename}`,
      `Entries/${entry._id!}.${fileExtension}`,
    );
    this.entryService.updateVideoURL(entry, uploadResult.uri);

    // Remove the EntryUpload entity
    this.entryUploadModel.deleteOne({
      entryID: entryUpload.entryID,
    });

    // Success
    return {
      entries: [entry],
      saveResult: {
        type: 'success',
      },
    };
  }

  /**
   * Try to save the new EntryUpload, this will first validate that the
   * EntryUpload meets the following requirements
   *
   * 1. The format of the entry matches the required schema
   * 2. The entryID is unique and not found in existing EntryUploads
   *    nor in regular Entries
   *
   * @return The result of attempting to save, if there is an error, a human
   *         readable error field will be present in the result
   */
  private async entryUploadSave(
    entryUpload: EntryUpload,
  ): Promise<SaveAttempt> {
    // Make sure the schema matches the expectation
    const schemaResult = await this.validateSchema(entryUpload);

    if (schemaResult.type == 'error') {
      return schemaResult;
    }

    // Trim required fields
    entryUpload.responderID = entryUpload.responderID.trim();
    entryUpload.entryID = entryUpload.entryID.trim();
    entryUpload.filename = entryUpload.filename.trim();

    // Make sure the EntryUpload ID is unique
    const entryExists =
      (await this.entryService.entryExists(entryUpload.entryID)) ||
      (await this.entryUploadExists(entryUpload.entryID));
    if (entryExists) {
      return {
        type: 'error',
        message: `Entry with ID ${entryUpload.entryID} already exists`,
      };
    }

    // Otherwise, save the new entry upload
    this.entryUploadModel.create(entryUpload);
    return { type: 'success' };
  }

  /**
   * Attempts to transform the flat row of the CSV into the format of
   * a EntryUpload. This will work by taking all required fields
   * and placing them at the root level of the object, then placing all
   * other fields and placing them within the metadata field.
   *
   * NOTE: This does not handle any schema validation, this only puts the
   *       data into the expected format.
   *
   * @param row The row to transform
   * @return The transformed EntryUpload
   */
  private transformRow(row: any): EntryUpload {
    const transformed = {
      entryID: row.entryID,
      responderID: row.responderID,
      filename: row.filename,
      meta: {},
    };

    delete row.entryID;
    delete row.responderID;
    delete row.filename;

    transformed.meta = { ...row };

    return transformed;
  }

  private async entryUploadExists(entryID: string): Promise<boolean> {
    const entryUpload = await this.entryUploadModel
      .findOne({ entryID: entryID })
      .exec();
    return entryUpload != null;
  }

  /**
   * Attempt to validate the object as a EntryUpload. On failure will
   * grab the errors in a human readable format.
   *
   * This calls the validation method through the Mongoose schema.
   *
   * @param obj The object to try to verify as a EntryUpload
   * @return SaveAttempt with the error field populated if an error has taken
   *         place
   */
  private async validateSchema(obj: any): Promise<SaveAttempt> {
    try {
      await this.entryUploadModel.validate(obj);
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

  /**
   * Wrapper around the extract logic
   */
  async extractZIP(path: string): Promise<SaveAttempt> {
    // Unzip the folder
    try {
      await new Promise<void>((resolve, reject) => {
        createReadStream(path)
          .pipe(unzipper.Extract({ path: './upload/entries' }))
          .on('finish', () => {
            resolve();
          })
          .on('error', () => {
            reject();
          });
      });
    } catch (error: any) {
      console.log(error);
      console.warn('Failed to extract user provided zip');
      return {
        type: 'error',
        message:
          'Was unable to extract provided ZIP, ensure the file is valid and not corrupt',
      };
    }

    return { type: 'success' };
  }
}
