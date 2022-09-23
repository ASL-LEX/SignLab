import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Actions,
  RankedTester,
  rankWith,
  composeWithUi,
  ControlElement,
} from '@jsonforms/core';
import { AslLexService } from '../../services/asl-lex.service';
import { VideoOption, VideoSelection } from './video-option-field.component';

/**
 * This component is a custom renderer for JSON Forms that allows users to
 * select either an ASL-LEX code or a SignBank code as an option. This will
 * render a search bar which will let users see the sign videos and select
 * from the list of matching videos
 */
@Component({
  selector: 'asl-lex-sign-bank',
  template: `
    <video-option-field
      [videoOptions]="tagSearchResults"
      [label]="label"
      [description]="description"
      [allowCustomOption]="allowCustomLabels"
      [debounceTime]="500"
      (videoSelected)="selectOption($event)"
      (searchValue)="searchUpdate($event)"
    ></video-option-field>
  `
})
export class AslLexSignBankField extends JsonFormsControl implements OnInit {
  tagSearchResults: VideoOption[] = [];
  signSearch = '';
  /** If the user can enter their own information in as a label */
  allowCustomLabels = false;

  constructor(
    jsonFormsService: JsonFormsAngularService,
    private aslLexService: AslLexService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(jsonFormsService);
  }

  ngOnInit(): void {
    // For JsonFormsControl
    super.ngOnInit();

    // Check to see if the `allowCustomTags` is an option present on the
    // JSON UI schema
    this.allowCustomLabels =
      this.uischema.options != undefined &&
      this.uischema.options.allowCustomLabels;
  }

  /**
   * Handles the selection of the tag to use from the user click. Will
   * update the search field with the selected sign's english tag.
   */
  selectOption(sign: VideoSelection) {
    if(sign.isCustom) {
      this.setLabelValue(`custom: ${sign.value}`);
    } else {
      this.setLabelValue(`code: ${sign.value}`);
    }
  }

  /**
   * Update the search result view based on the search parameter. Will hit
   * the AslLexService to get the results.
   */
  async searchUpdate(search: string) {
    const signs = await this.aslLexService.getAslLexView(search);

    // Convert the sign data into options for the videos select field
    this.tagSearchResults = signs.map(sign => {
      return { videoURL: sign.videoURL, code: sign.code, searchTerm: sign.englishTag };
    });
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Update the value of of this field
   */
  private setLabelValue(value: string) {
    // Update the value of the field via the JSON Forms backend
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => value));
    this.triggerValidation();
  }
}

/**
 * Tester which is used to determine if the AslLexSignBankField should be
 * used for a field for a given parameter.
 *
 * Will return true if the UI schema has an option field for "customType"
 * with a value of "asl-lex"
 */
export const aslLexSignBankControlRendererTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType != undefined &&
      uischema.options.customType == 'asl-lex'
    );
  }
);
