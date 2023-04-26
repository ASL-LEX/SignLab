import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { Study, StudySchema } from './study.schema';
import { AuthModule } from '../auth/auth.module';
import { EntryModule } from '../entry/entry.module';
import { EntryStudyModule } from '../entrystudy/entrystudy.module';
import { UserStudyModule } from '../userstudy/userstudy.module';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';
import { DatasetModule } from '../dataset/dataset.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Study.name, schema: StudySchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => EntryModule),
    forwardRef(() => EntryStudyModule),
    forwardRef(() => UserStudyModule),
    forwardRef(() => UserModule),
    forwardRef(() => TagModule),
    forwardRef(() => DatasetModule)
  ],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService]
})
export class StudyModule {}
