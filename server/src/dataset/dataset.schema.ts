import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Schema for the dataset collection
 */
@Schema()
@ObjectType()
export class Dataset {
  /** MongoDB assigned ID */
  @Field(() => ID, { name: 'id' })
  _id: string;

  /** Human readable way to idenfity the dataset, unique */
  @Prop({ unique: true, required: true })
  @Field({ description: 'Human readable way to idenfity the dataset, unique' })
  name: string;

  /** Human readable discription to describe the purpose of the dataset */
  @Prop({ required: true })
  @Field({
    description:
      'Human readable discription to describe the purpose of the dataset',
  })
  description: string;

  /** The user who created the dataset */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Field(() => User, { description: 'The user who created the dataset' })
  creator: User;
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
