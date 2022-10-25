import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';
import * as dtos from 'shared/dtos/dataset.dto';

/**
 * Schema for the dataset collection
 */
@Schema()
export class Dataset implements dtos.Dataset {
  /** MongoDB assigned ID */
  _id: string;

  /** Human readable way to idenfity the dataset, unique */
  @Prop({ unique: true, required: true })
  name: string;

  /** Human readable discription to describe the purpose of the dataset */
  @Prop({ required: true })
  description: string;

  /** The user who created the dataset */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  creator: User;
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
