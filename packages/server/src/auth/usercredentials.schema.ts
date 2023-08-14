import { InputType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dto from '../../../shared/dtos/user.dto';

/**
 * Stores information just on the credentials of the user, used for
 * signup and authentication logic
 */
@Schema()
@InputType()
export class UserCredentials implements dto.UserCredentials {
  @Prop()
  @Field()
  username: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  @Field(() => ID)
  organization: string;

  @Prop()
  @Field()
  password: string;
}

export type UserCredentialsDocument = UserCredentials & Document;
export const UserCredentialsSchema = SchemaFactory.createForClass(UserCredentials);
