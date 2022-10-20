import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as dtos from 'shared/dtos/dataset.dto';

/**
 * Schema for the dataset collection
 */
@Schema()
export class Dataset implements dtos.Dataset {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
