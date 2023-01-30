import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SchemaService } from './schema.service';
import { app } from '../main';

/**
 * Represents the intermediate state of a entry which is being uploaded
 * to SignLab. A EntryUpload represents a entry which is being added to
 * the system, but has not been fully uploaded. The EntryUpload keeps track
 * of information about the entry, before the entry video has been
 * added to the SignLab system. This differentiation allows for easier
 * validation of schema and fault resiliance if an upload fails.
 */
@Schema()
export class EntryUpload {
  /** MongoDB assigned ID */
  _id?: string;

  /**
   * Unique ID of the person who made the entry. This responderID is
   * something created an maintained by the user doing the upload. This exists
   * so that a researcher may keep track of what entrys where made by
   * what user outside of the SignLab system.
   *
   * ex) The researcher has a spreadsheet of responders that they keep track of
   */
  @Prop({ required: true, trim: true })
  responderID: string;

  /**
   * Unique ID of this entry. This ID is something created by the user doing
   * the upload. This allows for the researcher to maintain additional
   * information about this entry outside of the SignLab system.
   *
   * ex) The researcher has a spreadhsheet of entrys with additional
   *     metadata that isn't tracked/maintained in the SignLab system
   */
  @Prop({ required: true, trim: true })
  entryID: string;

  /**
   * The name of the file associated with the given EntryUpload. Later the
   * video entrys that are uploaded will be associated with a
   * EntryUpload based on filename.
   */
  @Prop({ required: true, trim: true })
  filename: string;

  /**
   * Stores addtional information about a entry which is important
   * to the researcher.
   *
   * NOTE: This metadata is the same as the Entry, so the Entry schema
   *       is used for validating it.
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

export type EntryUploadDocument = EntryUpload & Document;
export const EntryUploadSchema = SchemaFactory.createForClass(EntryUpload);
