import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Stores information just on the credentials of the user, used for
 * signup and authentication logic
 */
@Schema()
export class UserCredentials {
  @Prop()
  username: string;
  @Prop()
  password: string;
}

export type UserCredentialsDocument = UserCredentials & Document;
export const UserCredentialsSchema =
  SchemaFactory.createForClass(UserCredentials);
