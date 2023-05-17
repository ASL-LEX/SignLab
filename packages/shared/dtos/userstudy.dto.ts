import { User } from './user.dto';
import { Study } from './study.dto';
import { EntryStudy } from './entrystudy.dto';

/**
 * Contains the user as well as additional information on the user as they
 * relate to a study.
 */
export interface UserStudy {
  /** MongoDB provided ID */
  _id?: string;
  /** The user themselves */
  user: User;
  /** The study the user is associated with */
  study: Study;
  /** The training entrys the user has yet to complete */
  trainingEntryStudies: EntryStudy[];
}
