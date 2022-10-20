import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

/**
 * Schema for the dataset collection
 */
@Schema()
export class Dataset {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
