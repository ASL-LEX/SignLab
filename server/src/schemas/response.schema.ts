import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { app } from '../main';
import { SchemaService } from '../services/schema.service';

/**
 * A Response is a complete video entity in the SignLab system. A Response
 * differes from a ResponseUpload in that a Response has all information needed
 * to be in the SignLab system while a ResponseUpload is an intermediate
 * step with missing information
 */
@Schema()
export class Response {
  /** MongoDB assigned ID */
  _id?: string;

  /**
   * User assigned ID. This is useful if the researcher has additional pieces
   * of information regarding this response that is not uploaded to SignLab
   */
  @Prop({ required: true, trim: true })
  responseID: string;

  /**
   * URL of the video associated with this response.
   */
  @Prop({ required: true, trim: true })
  videoURL: string;

  /**
   * The duration of the video in milliseconds
   */
  @Prop({ required: false })
  duration?: number;

  /**
   * Flag which represents if this response was recorded in SignLab or not.
   */
  @Prop({ required: true })
  recordedInSignLab: boolean;

  /**
   * This Response ID is present if the Response was uploaded to SignLab
   * instead of being recorded in SignLab. This is a way for researchers
   * to tell who make their response against their own records.
   */
  @Prop({ required: false, trim: true })
  responderID?: string;

  /**
   * This field is present if the response was recorded in SignLab. If that
   * is the case, then a user of SignLab made the recording and that is how
   * the recorder of the response can be identified.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  recorder?: User;

  /**
   * Determines if the Response will be includeded in the studies. This
   * allows researchers to disable videos they no longer want to be part of
   * the study.
   */
  @Prop({ required: true })
  enabled: boolean;

  /**
   * Stores information specific to the research and decided by the researcher.
   */
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: async (value: any) => {
        const schemaService = app.get(SchemaService);
        return await schemaService.validate('Response', value);
      },
    },
  })
  meta: any;

  /**
   * Stores a mapping between study IDs and if this reponse has a tag
   * related to that study.
   *
   * This allows for easier querying to find the next response that needs to
   * be tagged based on study (frequently needed query). This does however
   * mean this field needs to be updated for all responses when a new study
   * is made (infrequent).
   *
   * The mapping is between a study ID and a boolean for if the response has
   * that tag or not.
   *
   * NOTE: A response that has a tag doesn't necessarily have a completed
   *       tag, a user could actively be completing the tag process which is
   *       ok because this keeps a race condition from taking place with
   *       two users trying to tag the same response at the same time.
   */
  @Prop({ type: mongoose.Schema.Types.Map })
  hasTag: Map<string, boolean>;
}

export type ResponseDocument = Response & Document;
export const ResponseSchema = SchemaFactory.createForClass(Response);
