import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from './entry.controller';
import { Entry, EntrySchema } from './entry.schema';
import { EntryUpload, EntryUploadSchema } from './entry-upload.schema';
import { EntryService } from './entry.service';
import { EntryUploadService } from './entry-upload.service';
import { BucketModule } from '../bucket/bucket.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { StudyModule } from '../study/study.module';
import { EntryStudyModule } from '../entrystudy/entrystudy.module';
import { TagModule } from '../tag/tag.module';
import { UserStudyModule } from '../userstudy/userstudy.module';
import { DatasetModule } from '../dataset/dataset.module';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entry.name, schema: EntrySchema },
      { name: EntryUpload.name, schema: EntryUploadSchema }
    ]),
    BucketModule,
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => StudyModule),
    forwardRef(() => EntryStudyModule),
    forwardRef(() => TagModule),
    forwardRef(() => UserStudyModule),
    forwardRef(() => DatasetModule),
    forwardRef(() => UserModule),
    forwardRef(() => OrganizationModule)
  ],
  controllers: [EntryController],
  providers: [EntryService, EntryUploadService],
  exports: [EntryService]
})
export class EntryModule {}
