import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dto from 'shared/dtos/user.dto';

@Schema()
export class Roles {
  @Prop()
  owner: boolean;

  /** Mapping between Project ID and if the user is an admin for that project */
  @Prop({ type: mongoose.SchemaTypes.Map })
  projectAdmin: {
    [projectID: string]: boolean;
  }

  /** Mapping between Study ID and if the user is an admin for that study */
  @Prop({ type: mongoose.SchemaTypes.Map })
  studyAdmin: {
    [studyID: string]: boolean;
  }

  /** Mapping between Study ID and if the user can contribute to that study */
  @Prop({ type: mongoose.SchemaTypes.Map })
  studyContributor: {
    [studyID: string]: boolean;
  }
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
