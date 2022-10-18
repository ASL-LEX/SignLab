import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStudyModule } from '../userstudy/userstudy.module';
import { StudyModule } from '../study/study.module';
import { UserModule } from '../user/user.module';
import { TagController } from './tag.controller';
import { TagGuard } from './tag.guard';
import { Tag, TagSchema } from './tag.schema';
import { TagService } from './tag.service';
import { EntryStudyModule } from '../entrystudy/entrystudy.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => StudyModule),
    forwardRef(() => UserStudyModule),
    forwardRef(() => EntryStudyModule),
    forwardRef(() => SharedModule),
  ],
  controllers: [TagController],
  providers: [TagService, TagGuard],
  exports: [TagService],
})
export class TagModule {}
