import { Component } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';

@Component({
  selector: 'new-project',
  template: `
    <mat-card>
      <mat-card-title>New Project</mat-card-title>
      <mat-card-content>
        <jsonforms
          [schema]="NEW_PROJECT_SCHEMA"
          [uischema]="NEW_PROJECT_UI_SCHEMA"
          [renderers]="renderers"
          (dataChange)="fieldChange($event)"
          (errors)="errorHandler($event)"
        ></jsonforms>

        <button mat-stroked-button (click)="projectSubmit()" [disabled]="!formValid">Submit</button>
      </mat-card-content>
    </mat-card>
  `
})
export class NewProjectComponent {
  NEW_PROJECT_SCHEMA = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
    },
    required: ['name', 'description'],
  };

  NEW_PROJECT_UI_SCHEMA = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/description',
      }
    ],
  };

  renderers = angularMaterialRenderers;

  formValid = false;
  formData: any = {};

  fieldChange(data: any) {
    this.formData = data;
  }

  errorHandler(errors: any[]) {
    this.formValid = errors.length === 0;
  }

  projectSubmit() {

  }

}
