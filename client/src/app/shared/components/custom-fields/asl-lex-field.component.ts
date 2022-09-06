import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Actions,
  RankedTester,
  rankWith,
  composeWithUi,
  ControlElement,
} from '@jsonforms/core';
import { AslLexService, TagSearchResult } from '../../services/asl-lex.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

/**
 * This component is a custom renderer for JSON Forms that allows users to
 * select either an ASL-LEX code or a SignBank code as an option. This will
 * render a search bar which will let users see the sign videos and select
 * from the list of matching videos
 */
@Component({
  selector: 'asl-lex-sign-bank',
  templateUrl: './asl-lex-field.component.html',
  styleUrls: ['./asl-lex-field.component.css'],
})
export class AslLexSignBankField extends JsonFormsControl implements OnInit {
  tagSearchResults: TagSearchResult[] = [];
  signSearchSubject = new Subject<string>();
  signSearch = '';
  selectedSignCode = '';
  /** If the user can enter their own information in as a label */
  allowCustomLabels = false;
  /** Helps control the active state of the custom option */
  customOptionSelected = false;

  constructor(
    jsonFormsService: JsonFormsAngularService,
    private aslLexService: AslLexService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(jsonFormsService);

    // Setup the ASL-LEX search handler
    this.signSearchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((search: string) => {
        this.searchUpdate(search);
      });
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Check to see if the `allowCustomTags` is an option present on the
    // JSON UI schema
    this.allowCustomLabels = this.uischema.options != undefined &&
                             this.uischema.options.allowCustomLabels;
  }

  /**
   * Handles the selection of the tag to use from the user click. Will
   * update the search field with the selected sign's english tag.
   */
  selectSign(sign: TagSearchResult) {
    this.signSearch = sign.englishTag;
    this.selectedSignCode = sign.code;
    this.customOptionSelected = false;

    this.setLabelValue(`code: ${sign.code}`);
  }

  /**
   * Handles if the user selected a custom response
   */
  selectCustomLabel(customLabel: string) {
    this.customOptionSelected = true;

    this.setLabelValue(`custom: ${customLabel}`);
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

  /**
   * Update the search result view based on the search parameter. Will hit
   * the AslLexService to get the results.
   */
  private async searchUpdate(search: string) {
    const signs = await this.aslLexService.getAslLexView(search);
    this.tagSearchResults = signs;
    this.changeDetectorRef.detectChanges();
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
