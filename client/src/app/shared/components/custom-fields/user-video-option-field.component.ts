import { Component, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { VideoOption, VideoSelection } from './video-option-field.component';
import {
  composeWithUi,
  Actions,
  ControlElement,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

/**
 * Provides videos are options to a user where the videos, identitfication
 * code, and search term was provided by an admin user.
 */
@Component({
  selector: 'user-video-option',
  template: `
    <video-option-field
      [videoOptions]="videoOptions"
      [label]="label"
      [description]="description"
      [allowCustomOption]="allowCustomLabels"
      [debounceTime]="500"
      (videoSelected)="selectOption($event)"
      (searchValue)="searchUpdate($event)"
    ></video-option-field>
  `,
})
export class UserVideoOption extends JsonFormsControl implements OnInit {
  /** The video options presented to the user based on user search */
  videoOptions: VideoOption[] = [];
  /** All of the possible video options */
  allVideoOptions: VideoOption[] = [];
  /** Controls if the user can enter a custom value */
  allowCustomLabels = false;

  constructor(jsonFormsService: JsonFormsAngularService) {
    super(jsonFormsService);
  }

  ngOnInit(): void {
    // For JsonFormsControl
    super.ngOnInit();

    // Check to see if `allowCustomLabels` is an option
    this.allowCustomLabels =
      this.uischema.options != undefined &&
      this.uischema.options.allowCustomLabels;

    // Pull out the video options from the data
    if (!this.uischema.options || !this.uischema.options.userVideoParameters) {
      console.error('Video options not provided, cannot use as field');
      return;
    }

    this.allVideoOptions = this.uischema.options.userVideoParameters;
  }

  selectOption(option: VideoSelection) {
    if (option.isCustom) {
      this.setLabelValue(`custom: ${option.value}`);
    } else {
      this.setLabelValue(`code: ${option.value}`);
    }
  }

  /** On search filter the videos to display to the user */
  searchUpdate(searchTerm: string): void {
    this.videoOptions = this.allVideoOptions.filter((option) => {
      return (
        option.searchTerm.toLowerCase().indexOf(searchTerm.toLowerCase()) == 0
      );
    });
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

export const userVideoOptionRendererTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType != undefined &&
      uischema.options.customType == 'video-options'
    );
  }
);
