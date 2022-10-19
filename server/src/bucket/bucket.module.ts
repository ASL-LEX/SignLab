import { Module } from '@nestjs/common';
import { BucketStorage } from './bucket.service';
import { BucketFactory } from './bucketfactory';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BucketStorage,
      useFactory: BucketFactory.getBucket,
      inject: [ConfigService],
    },
  ],
  exports: [BucketStorage],
})
export class BucketModule {}
