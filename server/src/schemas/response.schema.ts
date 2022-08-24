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
   * Stores information specific to the research and decided by the researcher.
   */
  @Prop({
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: async (value: any) => {
        const schemaService = app.get(SchemaService);
        return schemaService.validate('Response', value);
      },
    },
  })
  meta: any;
}

export type ResponseDocument = Response & Document;
export const ResponseSchema = SchemaFactory.createForClass(Response);
