import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Tag } from '../tag/tag.schema';
import mongoose from 'mongoose';

/**
 * Additional properties for Entries which are recorded in SignLab. These
 * properties allow for tracing the origin of the entry and for tracking
 * what study the entry was recorded for.
 */
@Schema()
export class SignLabEntryRecording {
  /** The tag the entry was recorded for */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Tag.name })
  tag: Tag;

  /** The name of the field within the tag that the entry was recorded for */
  @Prop({ required: true })
  fieldName: string;

  /** The video number, one tag field could have multiple videos (0 indexed) */
  @Prop({ required: true })
  videoNumber: number;
}

export const SignLabEntryRecordingSchema = SchemaFactory.createForClass(SignLabEntryRecording);
