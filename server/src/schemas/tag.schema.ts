import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Response } from './response.schema';
import { Study } from './study.schema';
import { User } from './user.schema';

@Schema()
export class Tag {
  /** MongoDB generated ID */
  _id: string;

  /**
   * Foreign key for the response that this tag is associated with.
   *
   * NOTE: This is the `_id` of the Response instead of the user defined
   *       `responseID`
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Response.name })
  response: Response;

  /**
   * The study that this tag is associated with.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Study.name })
  study: Study;

  /**
   * The user associated with the tag
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  /**
   * Flag for if the tag has been completed. A tag is created as soon as a
   * user is assigned a response to tag for a study, but the tag isn't
   * considered complete until the user has completed the tagging process.
   * This also makes it possible for a user to start the tagging process,
   * leave, and come back to the same response.
   */
  @Prop()
  complete: boolean;

  /**
   * The information associated with the tag changes from study to study
   */
  @Prop({ type: mongoose.Schema.Types.Mixed })
  info: any;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
