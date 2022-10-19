import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryStudyModule } from '../entrystudy/entrystudy.module';
import { UserStudy, UserStudySchema } from './userstudy.schema';
import { UserStudyService } from './userstudy.service';
import { StudyModule } from '../study/study.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserStudy.name, schema: UserStudySchema },
    ]),
    EntryStudyModule,
    forwardRef(() => StudyModule),
  ],
  controllers: [],
  providers: [UserStudyService],
  exports: [UserStudyService],
})
export class UserStudyModule {}
