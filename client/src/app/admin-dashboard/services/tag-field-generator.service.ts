import { Injectable } from '@angular/core';
import {
  TagField,
  TagFieldType,
  AslLexField,
  AutocompleteField,
  BooleanField,
  EmbeddedVideoOption,
  FreeTextField,
  NumericField,
  VideoRecordField
} from '../../models/tag-field';

/**
 * Service which provides factor methods for generating tag field options.
 */
@Injectable()
export class TagFieldGeneratorService {

  /**
   * Factory method to get the field definition associated with the given
   * field type.
   */
  async getTagField(tagFieldType: TagFieldType): Promise<TagField> {
      switch (tagFieldType) {
      case TagFieldType.AslLex:
        return new AslLexField();
      case TagFieldType.Autocomplete:
        return new AutocompleteField();
      case TagFieldType.BooleanOption:
        return new BooleanField();
      case TagFieldType.EmbeddedVideoOption:
        return new EmbeddedVideoOption();
      case TagFieldType.FreeText:
        return new FreeTextField();
      case TagFieldType.Numeric:
        return new NumericField();
      case TagFieldType.VideoRecord:
        return new VideoRecordField();
      default:
        return new FreeTextField();
    }
  }
}
