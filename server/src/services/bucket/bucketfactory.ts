import { ConfigService } from '@nestjs/config';
import { S3Storage } from './s3.service';
import { GCPBucketStorage } from './gcp.service';
import { BucketStorage } from './bucket.service';
import { LocalStorage } from './local.service';

export class BucketFactory {
  static getS3(bucketName: string, configService: ConfigService): S3Storage {
    const accessKeyId = configService.getOrThrow<string>('S3_ACCESS_ID');
    const secretAccessKey = configService.getOrThrow<string>(
      'S3_SECRET_ACCESS_KEY',
    );
    const baseUrl = configService.getOrThrow<string>('S3_BASE_URL');
    const endpoint: string | undefined =
      configService.get<string>('S3_ENDPOINT');

    const config = {
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      baseURL: baseUrl,
      endpoint: endpoint,
    };

    return new S3Storage(bucketName, config);
  }

  static getGCP(
    _bucketName: string,
    _configService: ConfigService,
  ): GCPBucketStorage {
    throw new Error('GCP Bucket Storage not yet supported');
  }

  static getLocal(
    bucketName: string,
    configService: ConfigService,
  ): LocalStorage {
    const folder = configService.getOrThrow<string>('BUCKET_LOCAL_FOLDER');

    return new LocalStorage(bucketName, folder);
  }

  /**
   * Will parse the provided configuration and determine what bucket
   * is being target by the provided credentials.
   *
   * Required Config
   *   * `BUCKET_TYPE`: The type of bucket interface supported: S3, LOCAL, soon-to-be supported: GCP
   *   * `BUCKET_NAME`: The name of the bucket to use
   *
   * S3 Required Config
   *   * `S3_ACCESS_ID`: The access ID associated with the S3 interface
   *   * `S3_SECRET_ACCESS_KEY`: The secret access key associated with the S3 interface
   *   * `S3_BASE_URL`: Base public URL for reconstructing URLs for objects
   *
   * Local Required Config
   *  * `BUCKET_LOCAL_FOLDER`: Where to locally store the objects
   */
  static getBucket(configService: ConfigService): BucketStorage {
    // Get the required information needed regardless of which bucket service
    // is used
    const bucketType = configService.getOrThrow<string>('BUCKET_TYPE');
    const bucketName = configService.getOrThrow<string>('BUCKET_NAME');

    switch (bucketType) {
      case 'S3':
        return BucketFactory.getS3(bucketName, configService);
      case 'GCP':
        return BucketFactory.getGCP(bucketName, configService);
      case 'LOCAL':
        return BucketFactory.getLocal(bucketName, configService);
      default:
        throw new Error(
          `${bucketType} is not supported, supported bucket interfaces are { S3, LOCAL }`,
        );
    }
  }
}
