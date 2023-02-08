import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.schema';
import mongoose from 'mongoose';

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: mongoose.Types.ObjectId;

  @Field()
  token: string;
}
