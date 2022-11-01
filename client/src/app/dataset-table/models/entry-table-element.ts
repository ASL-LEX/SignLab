import { Entry } from 'shared/dtos/entry.dto';

/**
 * Information that is needed to display the table. The `isPartOfStudy` and
 * `isUsedForTraining` are optional as they are only used if the table is
 * explicity configured for controlling those fields.
 */
export interface EntryTableElement {
  entry: Entry;
  isPartOfStudy: boolean;
  isUsedForTraining: boolean;
}

/**
 * Value which is used to represent a change in boolean value for a given
 * EntryTableElement. This is used for toggle controls.
 */
export interface EntryTableToggleChange {
  entryElem: EntryTableElement;
  option: boolean;
}
