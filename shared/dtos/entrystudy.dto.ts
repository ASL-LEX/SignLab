import { Entry } from './entry.dto';
import { Study } from './study.dto';

/**
 * Represents information on a entry as it pertains to a specific
 * study. This is used to control how a entry may be used within a
 * study.
 */
export interface EntryStudy {
  _id?: string;
  /** The entry this entry study represents */
  entry: Entry;
  /** The study that this entry study represents */
  study: Study;
  /** If the entry should be included in the tagging of the study */
  isPartOfStudy: boolean;
  /** If this entry should be presented for training */
  isUsedForTraining: boolean;
  /** If this entry has a tag for the given study */
  hasTag: boolean;
}
