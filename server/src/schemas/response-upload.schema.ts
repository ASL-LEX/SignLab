import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SchemaService } from '../services/schema.service';
import { app } from '../main';

/**
 * Represents the intermediate state of a response which is being uploaded
 * to SignLab. A ResponseUpload represents a response which is being added to
 * the system, but has not been fully uploaded. The ResponseUpload keeps track
 * of information about the response, before the response video has been
 * added to the SignLab system. This differentiation allows for easier
 * validation of schema and fault resiliance if an upload fails.
 */
@Schema()
export class ResponseUpload {
  /** MongoDB assigned ID */
  _id?: string;

  /**
   * Unique ID of the person who made the response. This responderID is
   * something created an maintained by the user doing the upload. This exists
   * so that a researcher may keep track of what responses where made by
   * what user outside of the SignLab system.
   *
   * ex) The researcher has a spreadsheet of responders that they keep track of
   */
  @Prop({ required: true, trim: true })
  responderID: string;

  /**
   * Unique ID of this response. This ID is something created by the user doing
   * the upload. This allows for the researcher to maintain additional
   * information about this response outside of the SignLab system.
   *
   * ex) The researcher has a spreadhsheet of responses with additional
   *     metadata that isn't tracked/maintained in the SignLab system
   */
  @Prop({ required: true, trim: true })
  responseID: string;

  /**
   * The name of the file associated with the given ResponseUpload. Later the
   * video responses that are uploaded will be associated with a
   * ResponseUpload based on filename.
   */
  @Prop({ required: true, trim: true })
  filename: string;

  /**
   * Stores addtional information about a response which is important
   * to the researcher.
   *
   * NOTE: This metadata is the same as the Response, so the Response schema
   *       is used for validating it.
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

export type ResponseUploadDocument = ResponseUpload & Document;
export const ResponseUploadSchema =
  SchemaFactory.createForClass(ResponseUpload);
