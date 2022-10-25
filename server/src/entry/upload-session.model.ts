import { Dataset } from 'shared/dtos/dataset.dto';
import { User } from 'shared/dtos/user.dto';
import { Result, Ok, Err } from '@sniptt/monads';
import { SaveAttempt } from 'shared/dtos/entry.dto';
import { EntryUpload } from './entry-upload.schema';
import { Readable } from 'stream';
import {ValidatorResult} from 'jsonschema';

const csv = require('csv-parser');

interface DatasetOption {
  /** The dataset information */
  dataset: Dataset;
  /** Represents if the dataset is created yet or not */
  created: boolean;
}

/**
 * Handles the process of uploading new entries to SignLab. The process
 * follows the following steps.
 *
 * 1. User selects dataset (or enters information for a new one) to upload to
 *    (setDataset)
 * 2. User provides supporting metadata (required fields, filename, etc)
 *    (setMetadata)
 * 3. User uploads a ZIP of the video files
 *    (uploadFiles)
 *
 * The process is broken up into three steps to allow for error checking at
 * each step. Each step could potentially cause an error and the user should
 * not be able to advance to the next step until errors have been resolved.
 *
 * NOTE: The user can go back to previous steps and change information. This
 *       means that this implementation has to support freeing up resources
 *       to occomodate the new information.
 */
export class UploadSession {
  /** The names of the files that will be uploaded */
  files: string[];
  /**
   * The dataset that is being targetted for the upload. The dataset may
   * be new in which case before the videos are uploaded the dataset will
   * be created.
   */
  dataset: DatasetOption | null = null;

  /**
   * Make a new instance of the session.
   *
   * @param user The user associated with the session
   */
  constructor(private user: User) {}

  /**
   * Update the sessions with the target dataset
   */
  setDataset(dataset: DatasetOption): void {
    this.dataset = dataset;
  }

  /**
   * Update the session with the supporting metadata and filenames for
   * the video files that will be uploaded in the next step
   */
  setMetadata(_files: string[]): Result<undefined, SaveAttempt> {
    // TODO: Store the current metadata and filenames to be attached to the
    //       video to create the full entry in the next step
    return Ok(undefined);
  }

  /**
   * Upload the video files to the server. This will create the dataset
   * if it does not exist yet.
   */
  uploadFiles(): Result<undefined, SaveAttempt> {
    // TODO: Run validation first, then make the dataset, then upload the
    //       files to the bucket. Finally create the cooresponding Entry
    return Ok(undefined);
  }
}

/**
 * Handles parsing the lines of the CSV with additional validation which
 * checks that the proper fields are present and returns any errors that
 * are generated and the cooresponding line numbers.
 */
class CSVParser {
  /**
   * Make a new instance of the CSVParser for the given stream.
   *
   * @param stream The stream to parse
   * @param validate Function which takes in a row and produces validator
   *                 results
   */
  constructor(private readonly stream: Readable,
              private readonly validate: (input: any) => ValidatorResult) {}

  /**
   * Parse the CSV and produce an array of entries on success, otherwise
   * return the errors that were generated.
   */
  async parse(): Promise<Result<EntryUpload[], SaveAttempt>> {
    const results: EntryUpload[] = [];
    try {
      const parser = this.stream.pipe(csv({ columns: true }));
      let lineNumber = 2; // Ignoring the header

      // Parse line-by-line
      for await (const row of parser) {
        // Parse the line and pass on the error if an error took place
        const transformResult = this.transformRow(row);
        if (transformResult.isErr()) {
          // If there is an error, return the error with the line number
          const err = transformResult.unwrapErr();
          return Err({
            ...err,
            place: `line ${lineNumber}`,
          });
        }

        // Otherwise add the entry to the results
        results.push(transformResult.unwrap());
        lineNumber += 1;
      }
    } catch (error: any) {
      return Err({
        type: 'error',
        message: `Failed to parse CSV: ${error.message}`,
      });
    }

    // If there are no errors, then return the results
    return Ok(results);
  }

  /** Transform the row from the CVS into an EntryUpload object. */
  private transformRow(row: any): Result<EntryUpload, SaveAttempt> {
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

    const validationResults = this.validate(transformed);
    if (!validationResults.valid) {
      return Err({
        type: 'error',
        message: `Invalid CSV: ${validationResults.errors}`,
      });
    }

    return Ok(transformed);
  }
}
