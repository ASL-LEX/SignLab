import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../user/user.schema';
import { app } from '../main';
import { SchemaService } from './schema.service';
import * as dto from 'shared/dtos/entry.dto';
import { Dataset } from '../dataset/dataset.schema';

/**
 * A Entry is a complete video entity in the SignLab system. A Entry
 * differes from a EntryUpload in that a Entry has all information needed
 * to be in the SignLab system while a EntryUpload is an intermediate
 * step with missing information
 */
@Schema()
export class Entry implements dto.Entry {
  /** MongoDB assigned ID */
  _id?: string;

  /**
   * User assigned ID. This is useful if the researcher has additional pieces
   * of information regarding this entry that is not uploaded to SignLab
   */
  @Prop({ required: true, trim: true })
  entryID: string;

  /**
   * URL of the video associated with this entry.
   */
  @Prop({ required: true, trim: true })
  videoURL: string;

  /**
   * The duration of the video in milliseconds
   */
  @Prop({ required: false })
  duration?: number;

  /**
   * Flag which represents if this entry was recorded in SignLab or not.
   */
  @Prop({ required: true })
  recordedInSignLab: boolean;

  /**
   * This Entry ID is present if the Entry was uploaded to SignLab
   * instead of being recorded in SignLab. This is a way for researchers
   * to tell who make their entry against their own records.
   */
  @Prop({ required: false, trim: true })
  responderID?: string;

  /**
   * This field is present if the entry was recorded in SignLab. If that
   * is the case, then a user of SignLab made the recording and that is how
   * the recorder of the entry can be identified.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  recorder?: User;

  /**
   * The dataset that the entry belongs to
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Dataset.name, required: true })
  dataset: Dataset;

  /**
   * Stores information specific to the research and decided by the researcher.
   */
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: async (value: any) => {
        const schemaService = app.get(SchemaService);
        return schemaService.validate('Entry', value);
      },
    },
  })
  meta: any;
}

export type EntryDocument = Entry & Document;
export const EntrySchema = SchemaFactory.createForClass(Entry);
