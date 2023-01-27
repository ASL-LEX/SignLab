import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { EntryStudy } from '../entrystudy/entrystudy.schema';
import { Study } from '../study/study.schema';
import { User } from '../user/user.schema';
import * as dto from 'shared/dtos/userstudy.dto';

/**
 * A `UserStudy` is used to represent information on a given user in relation
 * to a specific study. This includes training that the user may have to
 * complete and if the user has access to tag for this given study.
 */
@Schema()
export class UserStudy implements dto.UserStudy {
  /** MongoDB assigned ID */
  _id?: string;

  /** The user this is associated with */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  user: User;

  /** The study this is associated with */
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Study.name
  })
  study: Study;

  /**
   * The list of `EntryStudies` that the user needs to complete as part of
   * their training for this study. This list will shrink as the user
   * completes their training.
   */
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: EntryStudy.name }]
  })
  trainingEntryStudies: EntryStudy[];
}

export type UserStudyDocument = UserStudy & Document;
export const UserStudySchema = SchemaFactory.createForClass(UserStudy);
