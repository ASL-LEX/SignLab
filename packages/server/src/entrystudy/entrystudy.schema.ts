import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Entry } from '../entry/entry.schema';
import { Study } from '../study/study.schema';
import { Tag } from '../tag/tag.schema';

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
export class EntryStudy {
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
   * Represents the number of tags that exist for the entry in the specific
   * study. These represent the number of times it has been assigned. It
   * could be that the entry is assigned, but not finished.
   */
  @Prop({ required: true })
  numberTags: number;

  /** Tags associated with this entry study */
  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags: string[];
}

export type EntryStudyDocument = EntryStudy & Document;
export const EntryStudySchema = SchemaFactory.createForClass(EntryStudy);
