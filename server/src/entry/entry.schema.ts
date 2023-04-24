import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { app } from '../main';
import { SchemaService } from './schema.service';
import { Dataset } from '../dataset/dataset.schema';
import { SignLabEntryRecording, SignLabEntryRecordingSchema } from './signlab-recording.schema';
import { User } from '../user/user.schema';

/**
 * A Entry is a complete media entity in the SignLab system. A Entry
 * differes from a EntryUpload in that a Entry has all information needed
 * to be in the SignLab system while a EntryUpload is an intermediate
 * step with missing information
 */
@Schema()
export class Entry {
  /** MongoDB assigned ID */
  _id?: string;

  /**
   * User assigned ID. This is useful if the researcher has additional pieces
   * of information regarding this entry that is not uploaded to SignLab
   */
  @Prop({ required: true, trim: true })
  entryID: string;

  /**
   * URL of the media associated with this entry.
   */
  @Prop({ required: true, trim: true })
  mediaURL: string;

  /**
   * The type of media. Currently supports video or image
   */
  @Prop({ required: true, trim: true })
  mediaType: 'video' | 'image';

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
   * If the data is recorded in SignLab. This field will be present which
   * represents the tag the video was recorded for.
   */
  @Prop({ required: false, type: SignLabEntryRecordingSchema })
  signLabRecording?: SignLabEntryRecording;

  /**
   * The dataset that the entry belongs to
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Dataset.name,
    required: true
  })
  dataset: Dataset;

  /**
   * The person who created this entry. This could be done either through
   * uploading or recording in SignLab
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true
  })
  creator: User;

  /**
   * The date that this entry was created
   */
  @Prop({ required: true })
  dateCreated: Date;

  /**
   * Stores information specific to the research and decided by the researcher.
   */
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: async (value: any) => {
        const schemaService = app.get(SchemaService);
        return schemaService.validate('Entry', value);
      }
    }
  })
  meta: any;
}

export type EntryDocument = Entry & Document;
export const EntrySchema = SchemaFactory.createForClass(Entry);
