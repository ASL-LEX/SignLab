import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { Organization } from '../organization/organization.schema';

@Schema()
export class Roles {
  @Prop()
  owner: boolean;

  /** Mapping between Project ID and if the user is an admin for that project */
  @Prop({ type: mongoose.SchemaTypes.Map })
  projectAdmin: Map<string, boolean>;

  /** Mapping between Study ID and if the user is an admin for that study */
  @Prop({ type: mongoose.SchemaTypes.Map })
  studyAdmin: Map<string, boolean>;

  /** Mapping between Study ID and if the user can contribute to that study */
  @Prop({ type: mongoose.SchemaTypes.Map })
  studyContributor: Map<string, boolean>;

  /** Mapping between Study ID and if the user can view that study */
  @Prop({ type: mongoose.SchemaTypes.Map })
  studyVisible: Map<string, boolean>;
}

const RolesSchema = SchemaFactory.createForClass(Roles);

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  @Field(() => Organization)
  organization: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  username: string;

  @Prop({ type: RolesSchema })
  @Field(() => JSON)
  roles: Roles;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
