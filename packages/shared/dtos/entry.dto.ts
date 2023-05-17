import { Dataset } from './dataset.dto';
import {User} from './user.dto';

/**
 * Way of conveying information about a location an error took place. This
 * is used for conveying what line the error took place and what that error
 * was.
 */
export interface LocationInfo {
  place: string,
  message: string
}

/**
 * Interface for presenting errors to the user. This is intended to be
 * a human readable format for finding out where exactly the issue took place.
 *
 * The type defines that result.
 *   success - Nothing went wrong, everything saved fine
 *   warning - Not everything went well, parts of the data were saved, but
 *             not everything, some data may need to be re-uploaded
 *   error   - Something critical took place so that no data could be saved
 *
 * The message is the overarching description of what took place. This is
 * where helps explain to the user if info needs to be re-uploaded, etc
 *
 * Where keeps track of the erros on a per location basis. This allows multiple
 * issues to be kept track of and the locations of those issues. For example,
 * where: [
 *    {
 *      place: 'Line 1',
 *      message: 'Missing prompt'
 *    }
 * ]
 * This lets users more quickly find the location of issues
 */
export interface SaveAttempt {
  type: 'success' | 'warning' | 'error';
  message?: string;
  where?: LocationInfo[]
}

/**
 * Interface for a single entry. A entry in the system represents a
 * single entity the is tagged in the system.
 */
export interface Entry {
  _id?: string;
  /**
   * Way to uniquely identify the entry in the system. This is a user
   * defined value.
   */
  entryID: string;
  /**
   * This is the location of the entry itself as a URL.
   */
  mediaURL: string;
  /**
   * The type of media. Currently supports video or image
   */
  mediaType: 'video' | 'image';
  /**
   * This is how long the media is in milliseconds.
   */
  duration?: number;
  /**
   * This represents if the entry was recorded in SignLab or not.
   */
  recordedInSignLab: boolean;
  /**
   * This is the ID of the responder. If the entry was not recorded in
   * SignLab, this will be populated as a way to identify the person who
   * made this entry. If this entry was recorded in SignLab, a
   * SignLab user will be associated with the entry.
   */
  responderID?: string;
  /**
   * The dataset that this entry is a part of
   */
  dataset: Dataset;
  /**
   * The person who created this entry. This could be done either through
   * uploading or recording in SignLab
   */
  creator: User;
  /**
   * The date that this entry was created
   */
  dateCreated: Date;
  /**
   * This defines any additional meta data which is specific to the instance
   * of SignLab and can thus change instance to instance
   */
  meta: any;
}

/**
 * Represents how metadata is shared.
 */
export interface MetadataDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
}
