import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryStudy, EntryStudySchema } from './entrystudy.schema';
import { EntryStudyService } from './entrystudy.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: EntryStudy.name, schema: EntryStudySchema }])],
  controllers: [],
  providers: [EntryStudyService],
  exports: [EntryStudyService]
})
export class EntryStudyModule {}
