import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Represents a single project which is part of an organization.
 */
@Schema()
@ObjectType({ description: 'Projects that are part of an organization' })
export class Project {
  /** MongoDB assigned ID */
  @Field(() => ID, { description: 'unique identifier for the project' })
  _id: string;

  @Prop({ required: true })
  @Field({ description: 'name of the project, unique in an organization' })
  name: string;

  @Prop({ required: true })
  @Field({ description: 'description of the project' })
  description: string;

  @Prop({ required: true })
  @Field({ description: 'organization that the project belongs to' })
  created: Date;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
