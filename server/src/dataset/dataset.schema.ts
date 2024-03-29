import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import mongoose from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

/**
 * Schema for the dataset collection
 */
@Schema()
@ObjectType()
export class Dataset {
  /** MongoDB assigned ID */
  @Field(() => ID, { name: 'id' })
  _id: string;

  /** The organization the dataset is a part of */
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  organization: string;

  /** Human readable way to idenfity the dataset, unique */
  @Prop({ required: true })
  @Field({ description: 'Human readable way to idenfity the dataset, unique' })
  name: string;

  /** Human readable discription to describe the purpose of the dataset */
  @Prop({ required: true })
  @Field({
    description: 'Human readable discription to describe the purpose of the dataset'
  })
  description: string;

  /** The user who created the dataset */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @Field(() => User, { description: 'The user who created the dataset' })
  creator: User;

  /** Mapping of the different projects that have access to the dataset */
  @Prop({ type: mongoose.SchemaTypes.Map })
  @Field(() => JSON)
  projectAccess: {
    [key: string]: boolean;
  };
}

export type DatasetDocument = Dataset & Document;
export const DatasetSchema = SchemaFactory.createForClass(Dataset);
