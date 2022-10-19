import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as dto from 'shared/dtos/user.dto';

@Schema()
export class Roles {
  @Prop()
  owner: boolean;

  @Prop()
  admin: boolean;

  @Prop()
  tagging: boolean;

  @Prop()
  recording: boolean;

  @Prop()
  accessing: boolean;
}

const RolesSchema = SchemaFactory.createForClass(Roles);

@Schema()
export class User implements dto.User {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop({ type: RolesSchema })
  roles: Roles;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
