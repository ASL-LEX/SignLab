import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dto from 'shared/dtos/project.dto';
import { User } from '../user/user.schema';


/**
 * Represents a single project which is part of an organization.
 */
@Schema()
export class Project implements dto.Project {
  /** MongoDB assigned ID */
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  creator: User;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
