import { BucketStorage, BucketFile } from './bucket.service';
import { S3 } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';
import { Readable } from 'stream';
import { createWriteStream } from 'fs';

/**
 * Implementation for interacting with objects stored in an S3 bucket using
 * the AWS SDK v3.
 */
export class S3V3Storage extends BucketStorage {
  private s3: S3;
  private baseURL: string;

  constructor(
    bucketName: string,
    config: {
      credentials: { accessKeyId: string; secretAccessKey: string };
      baseURL: string;
      endpoint?: string;
    },
  ) {
    super(bucketName);

    this.s3 = new S3({
      credentials: config.credentials,
      endpoint: config.endpoint,
      region: 'us-east-1',
      forcePathStyle: true,
    });

    this.baseURL = config.baseURL;
  }

  async objectUpload(path: string, target: string): Promise<BucketFile> {
    const params = {
      Bucket: this.bucketName,
      Key: target,
      Body: await readFile(path),
    };
    const result = await this.s3.putObject(params);

    if (result.$metadata.httpStatusCode != 200) {
      throw new Error(
        `Failed to upload file to S3 with HTTP Code ${result.$metadata.httpStatusCode}`,
      );
    }

    return { name: target, uri: `${this.baseURL}/${target}` };
  }

  async objectDownload(path: string, target: string): Promise<void> {
    const params = { Bucket: this.bucketName, Key: target };
    const result = await this.s3.getObject(params);
    if (result.Body) {
      return this.writeToFile(result.Body as Readable, path);
    } else {
      throw new Error('No valid object returned');
    }
  }

  // NOTE: Untested
  async objectExists(target: string): Promise<boolean> {
    const params = { Bucket: this.bucketName, Key: target };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (error: any) {
      if (error.code == 'NotFound') {
        return false;
      }
    }
    return false;
  }

  async objectDelete(target: string): Promise<void> {
    // If the target is provided with the base url, remove the base URL portion
    target = target.replace(`${this.baseURL}/`, '');

    const params = { Bucket: this.bucketName, Key: target };
    await this.s3.deleteObject(params);
  }

  /**
   * Helper to write out the data into a file
   */
  async writeToFile(body: Readable, path: string): Promise<void> {
    const fileStream = createWriteStream(path);
    return new Promise((resolve, reject) => {
      body.on('data', (chunk: any) => {
        fileStream.write(chunk);
      });
      body.on('error', reject);
      body.on('end', () => {
        resolve();
      });
    });
  }
}
