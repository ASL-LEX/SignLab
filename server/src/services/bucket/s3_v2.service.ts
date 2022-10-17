import { BucketFile, BucketStorage } from './bucket.service';
import { readFile } from 'fs/promises';
import { Readable } from 'stream';
import { createWriteStream } from 'fs';
import { S3, Endpoint } from 'aws-sdk';

/**
 * Implmentation of the S3 service for the V2 API.
 */
export class S3V2Storage extends BucketStorage {
  private s3: AWS.S3;
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

    const ep = new Endpoint(config.endpoint!);
    this.s3 = new S3({
      credentials: config.credentials,
      endpoint: ep,
      apiVersion: '2006-03-01',
      region: 'us-east-1',
      s3ForcePathStyle: true,
    });

    this.baseURL = config.baseURL;
  }

  async objectUpload(path: string, target: string): Promise<BucketFile> {
    const params = {
      Bucket: this.bucketName,
      Key: target,
      Body: await readFile(path),
    };
    await this.s3.putObject(params).promise();

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err: any, _data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({ name: target, uri: `${this.baseURL}/${target}` });
        }
      });
    });
  }

  async objectDownload(path: string, target: string): Promise<void> {
    const params = { Bucket: this.bucketName, Key: target };
    const result = await this.s3.getObject(params).promise();
    if (result.Body) {
      return this.writeToFile(result.Body as Readable, path);
    } else {
      throw new Error('No valid object returned');
    }
  }

  async objectExists(target: string): Promise<boolean> {
    const params = { Bucket: this.bucketName, Key: target };
    try {
      await this.s3.headObject(params).promise();
      return true;
    } catch (err: any) {
      if (err.code === 'NotFound') {
        return false;
      } else {
        throw err;
      }
    }
  }

  async objectDelete(target: string): Promise<void> {
    const params = { Bucket: this.bucketName, Key: target };
    await this.s3.deleteObject(params).promise();
  }

  private writeToFile(stream: Readable, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path);
      stream.pipe(writeStream);
      stream.on('error', (err) => {
        reject(err);
      });
      writeStream.on('finish', () => {
        resolve();
      });
    });
  }
}
