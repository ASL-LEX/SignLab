import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  Actions,
  composeWithUi,
  ControlElement,
  isOneOfEnumControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators';

/**
 * This component provides support for the "oneOf" parameters that should
 * be supported by JSON Forms. At the time of writing this, JSON forms does
 * not seem to provide support for the "oneOf" type for Angular.
 *
 * The "oneOf" field provides the user to display a list of options where the
 * value does not have to be the same as what is displayed. This is useful
 * for displaying a list of options that are not just strings.
 *
 * JSON Forms does provide an implementation for React so this component
 * is heavily influenced by that implementation.
 *
 * https://github.com/eclipsesource/jsonforms/blob/master/packages/material/src/controls/MaterialOneOfEnumControl.tsx
 *
 * NOTE: This component is a direct modification of the autocomplete component
 *       from JSON forms. Below is the cooresponding license
 *
 * BEGIN LICENSE
 *
 * The MIT License
 * Copyright (c) 2019 EclipseSource Munich
 * https://github.com/eclipsesource/jsonforms
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * END LICENSE
 */
@Component({
  selector: 'one-of',
  template: `
    <mat-form-field fxFlex [fxHide]="hidden">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        type="text"
        (change)="onChange($event)"
        [id]="id"
        [formControl]="form"
        [matAutocomplete]="auto"
        (keydown)="updateFilter($event)"
      />
      <mat-autocomplete
        autoActiveFirstOption
        #auto="matAutocomplete"
        (optionSelected)="onSelect($event)"
      >
        <mat-option
          *ngFor="let option of filteredOptions | async"
          [value]="option.const"
        >
          {{ option.title }}
        </mat-option>
      </mat-autocomplete>
      <mat-hint *ngIf="shouldShowUnfocusedDescription()">{{ description }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneOfField extends JsonFormsControl {
  filteredOptions: Observable<{ title: string, const: any}[]>;
  shouldFilter: boolean;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  getEventValue = (event: any) => event.target.value;

  ngOnInit() {
    super.ngOnInit();
    this.shouldFilter = false;
    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  updateFilter(event: any) {
    // ENTER
    if (event.keyCode === 13) {
      this.shouldFilter = false;
    } else {
      this.shouldFilter = true;
    }
  }

  onSelect(ev: MatAutocompleteSelectedEvent) {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.shouldFilter = false;
    this.jsonFormsService.updateCore(Actions.update(path, () => ev.option.value));
    this.triggerValidation();
  }

  filter(val: string): { title: string, const: any }[] {
    const options = this.scopedSchema.oneOf as { title?: string, const?: any }[];
    if (options === undefined) {
      return [];
    }

    const filtered = options.filter(option => {
      if (option.title === undefined || option.const === undefined) {
        return false;
      }
      return option.title.toLowerCase().indexOf(val.toLowerCase()) === 0;
    });

    // At this point because of the filtering, both the title and const
    // value will be present
    return filtered as { title: string, const: any }[];
  }
}

export const oneOfFieldTester: RankedTester = rankWith(10, isOneOfEnumControl);
