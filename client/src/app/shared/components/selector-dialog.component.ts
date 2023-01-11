import { Component, Input, Output, EventEmitter } from '@angular/core';

/** The needed information to display the options */
export interface SelectDialogOptions {
  name: string;
  value: any;
};

/**
 * Provides a common interface for listing out options that can be selected.
 * This is the base used by the StudySelectDialog and ProjectSelectDialog.
 */
@Component({
  selector: 'selector-dialog',
  templateUrl: './selector-dialog.component.html',
})
export class SelectorDialog {
  /** Header displayed at the top of the option list */
  @Input() header: string = '';
  /** List of options the user can select from */
  @Input() options: SelectDialogOptions[] = [];
  /** The selected option */
  @Input() selected: any = null;
  @Output() selectedChange = new EventEmitter<any>();
}
