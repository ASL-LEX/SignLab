import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Response } from './response.schema';
import { Study } from './study.schema';

/**
 * A `ResponseStudy` is used to represent information about a response
 * as it relates to a specific study. The creation of this entity
 * seperate from the `Response` is to solve the following issues.
 *
 * 1. Searching for the next untagged `Response` for a study given that
 *    not all responses are enabled for all studies
 * 2. Different studies will use different responses for training, and there
 *    needs to be a way to easily get the training responses for a given
 *    study.
 */
@Schema()
export class ResponseStudy {
  /** MongoDB assigned ID */
  _id?: string;

  /** The response that this entity maps to */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Response.name })
  response: Response;

  /** The study that this entity maps to */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Study.name })
  study: Study;

  /**
   * Flag which controls if the cooresponding response should be included
   * in the study.
   */
  @Prop({ required: true })
  isPartOfStudy: boolean;

  /**
   * Flag which controls if the cooresponding response should be used as part
   * of the training for this study.
   */
  @Prop({ required: true })
  isUsedForTraining: boolean;

  /**
   * Flag that represents if the response has been given a tag as part of
   * this study. Used to determine which responses need to be tagged next.
   *
   * NOTE: Having a tag doesn't mean there is a complete tag. A user could
   *       have been assigned to tag this response and have not yet completed
   *       that tag.
   */
  @Prop({ required: true })
  hasTag: boolean;
}

export type ResponseStudyDocument = ResponseStudy & Document;
export const ResponseStudySchema = SchemaFactory.createForClass(ResponseStudy);
