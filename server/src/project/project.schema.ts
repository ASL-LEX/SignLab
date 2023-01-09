import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as dto from 'shared/dtos/project.dto';


/**
 * Represents a single project which is part of an organization.
 */
@Schema()
export class Project implements dto.Project {
  /** MongoDB assigned ID */
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  createdDate: Date;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
