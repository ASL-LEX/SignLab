import { Injectable } from '@nestjs/common';

/**
 * Representation of a single file in a bucket
 */
export interface BucketFile {
  name: string;
  uri: string;
}

@Injectable()
export abstract class BucketStorage {
  constructor(protected bucketName: string) {}

  /**
   * Upload a file to the bucket.
   *
   * If the file is provided as a string, it will be treated as a path
   * to a file t to read. If the file is a buffer, it will be assumed to be
   * the contents of the file to upload.
   *
   * @param file Path to the locally stored file to upload or the contents of the file
   * @param target The target location to store the file in the bucket
   * @return The generated bucket file
   */
  abstract objectUpload(file: string | Buffer, target: string): Promise<BucketFile>;

  /**
   * Download a file from the bucket to local storage
   *
   * @param path Path to the location locally to store the file
   * @param target The object in the bucket to download
   * @return The generated bucket file
   */
  abstract objectDownload(path: string, target: string): Promise<void>;

  /**
   * Check to see if an object exists at the given location.
   *
   * @param target The object to check for the existence of in the bucket
   */
  abstract objectExists(target: string): Promise<boolean>;

  /**
   * Remove the file at the given location.
   *
   * @param target The object to remove from the bucket
   */
  abstract objectDelete(target: string): Promise<void>;
}
