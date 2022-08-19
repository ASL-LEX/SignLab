import { Response } from './response.dto';
import { Study } from './study.dto';

/**
 * Represents information on a response as it pertains to a specific
 * study. This is used to control how a response may be used within a
 * study.
 */
export interface ResponseStudy {
  _id?: string;
  /** The response this response study represents */
  response: Response;
  /** The study that this response study represents */
  study: Study;
  /** If the response should be included in the tagging of the study */
  isPartOfStudy: boolean;
  /** If this response should be presented for training */
  isUsedForTraining: boolean;
  /** If this response has a tag for the given study */
  hasTag: boolean;
}
