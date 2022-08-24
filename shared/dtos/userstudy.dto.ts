import { User } from './user.dto';
import { Study } from './study.dto';
import { ResponseStudy } from './responsestudy.dto';

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
  /** The training responses the user has yet to complete */
  trainingResponseStudies: ResponseStudy[];
  /** If the user has access to the given study */
  hasAccessToStudy: boolean;
}
