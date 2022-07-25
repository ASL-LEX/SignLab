import { Response } from './response.dto';
import { User } from './user.dto';
import { Study } from './study.dto';

/**
 * This represents a single tag in the SignLab system. A tag is assocaited
 * with a single response per study.
 */
export interface Tag {
  /** Unique identifier for the tag */
  _id: string;
  /** The response the tag is assocaited with */
  response: Response;
  /** The study the tag is associated with */
  study: Study;
  /** The user in SignLab who made this tag */
  user: User;
  /** Represents if the user has completed the tag */
  complete: boolean;
  /** The data that makes up the tag, depends on the schema of the study */
  info: any;
}
