import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Entry } from '../entry/entry.schema';
import { Study } from '../study/study.schema';
import * as dto from 'shared/dtos/entrystudy.dto';

/**
 * A `EntryStudy` is used to represent information about a entry
 * as it relates to a specific study. The creation of this entity
 * seperate from the `Entry` is to solve the following issues.
 *
 * 1. Searching for the next untagged `Entry` for a study given that
 *    not all entries are enabled for all studies
 * 2. Different studies will use different entries for training, and there
 *    needs to be a way to easily get the training entries for a given
 *    study.
 */
@Schema()
export class EntryStudy implements dto.EntryStudy {
  /** MongoDB assigned ID */
  _id?: string;

  /** The entry that this entity maps to */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Entry.name
  })
  entry: Entry;

  /** The study that this entity maps to */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Study.name
  })
  study: Study;

  /**
   * Flag which controls if the cooresponding entry should be included
   * in the study.
   */
  @Prop({ required: true })
  isPartOfStudy: boolean;

  /**
   * Flag which controls if the cooresponding entry should be used as part
   * of the training for this study.
   */
  @Prop({ required: true })
  isUsedForTraining: boolean;

  /**
   * Flag that represents if the entry has been given a tag as part of
   * this study. Used to determine which entries need to be tagged next.
   *
   * NOTE: Having a tag doesn't mean there is a complete tag. A user could
   *       have been assigned to tag this entry and have not yet completed
   *       that tag.
   */
  @Prop({ required: true })
  hasTag: boolean;
}

export type EntryStudyDocument = EntryStudy & Document;
export const EntryStudySchema = SchemaFactory.createForClass(EntryStudy);
