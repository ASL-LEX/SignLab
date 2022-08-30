import { Response } from 'shared/dtos/response.dto';

/**
 * Information that is needed to display the table. The `isPartOfStudy` and
 * `isUsedForTraining` are optional as they are only used if the table is
 * explicity configured for controlling those fields.
 */
export interface ResponseTableElement {
  response: Response;
  isPartOfStudy: boolean;
  isUsedForTraining: boolean;
}

/**
 * Value which is used to represent a change in boolean value for a given
 * ResponseTableElement. This is used for toggle controls.
 */
export interface ResponseTableToggleChange {
  responseElem: ResponseTableElement;
  option: boolean;
}
