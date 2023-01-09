import { Component, Output, EventEmitter } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { createAjv } from '@jsonforms/core';
import { NewStudyMeta } from '../../models/new-study';

/**
 * Represents the form which handles the metadata what is needed to be
 * known about the study such as name, description, and instructions.
 *
 * The form is generated using JSON Forms
 */
@Component({
  selector: 'study-required-info',
  template: `
    <mat-card>
      <mat-card-title>Study Information</mat-card-title>
      <mat-card-content>
        <jsonforms
          [schema]="requiredDataSchema"
          [uischema]="requiredDataUISchema"
          [renderers]="requiredDataRenderers"
          [ajv]="ajv"
          (dataChange)="requiredFieldChange($event)"
          (errors)="requiredDataErrorHandler($event)"
        ></jsonforms>
      </mat-card-content>
    </mat-card>
  `,
})
export class RequiredInfoComponent {
  /**
   * JSON Forms representation of the data that is collected as required
   * information for a study
   */
  requiredDataSchema = JSON_FORMS_DATA_SCHEMA;
  /**
   * JSON Forms representation of how to display the required fields
   */
  requiredDataUISchema = JSON_FORMS_UI_SCHEMA;
  /**
   * JSON Forms renderes for the form view
   */
  requiredDataRenderers = angularMaterialRenderers;
  /** Configure how errors are presented */
  ajv = createAjv({ schemaId: 'id', allErrors: true });
  /** Stores the entry meta information */
  requiredData: NewStudyMeta | null = null;
  @Output() requiredDataChange = new EventEmitter<NewStudyMeta | null>();

  /**
   * Updated the data field when changes are made. If there is errors in
   * the data, a null value is emitted
   */
  requiredFieldChange(data: any) {
    this.requiredData = data;
  }

  /**
   * Output null if the data is invalid or the form data if the data is
   * valid.
   */
  requiredDataErrorHandler(errors: any[]) {
    const requiredDataValid = errors.length == 0;
    if (requiredDataValid) {
      this.requiredDataChange.emit(this.requiredData);
    } else {
      this.requiredDataChange.emit(null);
    }
  }
}

/**
 * The form data in JSON Forms schema
 */
const JSON_FORMS_DATA_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    instructions: {
      type: 'string',
    },
  },
  required: ['name', 'description', 'instructions'],
};

/**
 * The form data view in JSON Forms schema
 */
const JSON_FORMS_UI_SCHEMA = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      scope: '#/properties/description',
    },
    {
      type: 'Control',
      scope: '#/properties/instructions',
    },
  ],
};
