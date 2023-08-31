import { BucketStorage, BucketFile } from './bucket.service';
import { Storage, Bucket } from '@google-cloud/storage';

/**
 * Implementation for saving in GCP buckets.
 *
 * NOTE: This implementation is un-tested. This exists as a placeholder for
 *       when potential GCP is supported as a platform to deploy to.
 */
export class GCPBucketStorage extends BucketStorage {
  private storage: Storage;
  private bucket: Bucket;

  constructor(bucketName: string, credentials: { keyFilename: string }) {
    super(bucketName);

    this.storage = new Storage(credentials);
    this.bucket = this.storage.bucket(bucketName);
  }

  async objectUpload(path: string, target: string, contentType: string): Promise<BucketFile> {
    const result = await this.bucket.upload(path, { destination: target });
    return { name: result[0].name, uri: result[0].cloudStorageURI.toString() };
  }

  async objectDownload(path: string, target: string): Promise<void> {
    const file = this.bucket.file(target);
    file.download({ destination: path });
  }

  async objectExists(target: string): Promise<boolean> {
    const file = this.bucket.file(target);
    return (await file.exists())[0];
  }

  async objectDelete(target: string): Promise<void> {
    const file = this.bucket.file(target);
    file.delete();
  }
}
