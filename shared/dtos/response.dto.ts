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
