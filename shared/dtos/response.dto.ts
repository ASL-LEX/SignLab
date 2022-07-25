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
 * Interface for a single response. A response in the system represents a
 * single entity the is tagged in the system.
 */
export interface Response {
  /**
   * Way to uniquely identify the response in the system. This is a user
   * defined value.
   */
  responseID: string;
  /**
   * This is the location of the response itself as a URL.
   */
  videoURL: string;
  /**
   * This is how long the video is in milliseconds.
   */
  duration?: number;
  /**
   * This represents if the response was recorded in SignLab or not.
   */
  recordedInSignLab: boolean;
  /**
   * This is the ID of the responder. If the response was not recorded in
   * SignLab, this will be populated as a way to identify the person who
   * made this response. If this response was recorded in SignLab, a
   * SignLab user will be associated with the response.
   */
  responderID?: string;
  /**
   * This is a flag that represents if the response is enabled in the SignLab
   * system and therefore able to be tagged.
   */
  enabled: boolean;
  /**
   * This defines any additional meta data which is specific to the instance
   * of SignLab and can thus change instance to instance
   */
  meta: any;
  /**
   * This is a mapping between study's and if the response has a tag for
   * the given study.
   */
  hasTag: any;
}
