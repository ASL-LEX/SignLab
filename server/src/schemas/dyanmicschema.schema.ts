import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

/**
 * A Dynamic schema represents schema which the user defines. The Dynamic
 * schema stores a JSON schema representation which is used for data
 * validation.
 *
 * An example use case is for Entries. Entries can have additional
 * meta data which is configured by the user. That meta data is considered
 * a dynamic schema and stored here.
 */
@Schema()
export class DynamicSchema {
  /**
   * This is how the schema is identified. Typically this is the data that
   * this dyanmic schema is associated with. So for example, Entries
   * will have a DynamicSchema entry with the schemaName of Entry.
   */
  @Prop()
  schemaName: string;

  /**
   * This is the schema itself. It is a JSON Schema object stored in the
   * database
   */
  @Prop({ type: mongoose.Schema.Types.Mixed })
  schema: any;
}

export type DynamicSchemaDocument = DynamicSchema & Document;
export const DynamicSchemaSchema = SchemaFactory.createForClass(DynamicSchema);
