import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Project } from '../project/project.schema';

/**
 * Defined the two aspects of the tag schema which is the properties and
 * types of the data contained in the tag and the cooresponding UI schema
 * which defines how to render the UI.
 */
@Schema()
export class TagSchema {
  /**
   * The schema which details the contained information in the tag following
   * the JSON schema standard
   */
  @Prop({ type: mongoose.Schema.Types.Mixed })
  dataSchema: any;

  /** The UI schema which follows the JSON Forms standard */
  @Prop({ type: mongoose.Schema.Types.Mixed })
  uiSchema: any;
}

const TagSchemaSchema = SchemaFactory.createForClass(TagSchema);

@Schema()
export class Study {
  /** MongoDB assigned ID */
  _id?: string;

  /** Human readable name for identification */
  @Prop({ required: true })
  name: string;

  /**
   * Human readable description of the study for informational purposes
   */
  @Prop({ required: true })
  description: string;

  /**
   * Human readable instructions which will be provided to the taggers
   * when tagging entries for this study.
   */
  @Prop({ required: true })
  instructions: string;

  /**
   * JSON Schema schema that defines the information contained in each tag
   * associated with this study.
   */
  @Prop({ type: TagSchemaSchema, required: true })
  tagSchema: TagSchema;

  /**
   * The project the study is a part of
   */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: Project.name, required: true })
  project: Project | string;

  /** The number of tags needed per entry for the study to be complete */
  @Prop({ required: true })
  tagsPerEntry: number;
}

export type StudyDocument = Study & Document;
export const StudySchema = SchemaFactory.createForClass(Study);
