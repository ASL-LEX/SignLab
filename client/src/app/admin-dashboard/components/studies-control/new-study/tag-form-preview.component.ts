import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {JsonSchema} from '@jsonforms/core';

type TagPreviewInformation = {
  previewDataSchema: JsonSchema,
  previewUiSchema: any,
  renderers: any
};

@Component({
  selector: 'tag-form-preview',
  template: `
    <mat-dialog-content>
      <div fxLayout="row" fxLayoutAlign="space-around">
        <!-- The video place holder -->
        <div style="background: black; width: 400px; height: 400px">
          <p style="color: white">Video Placeholder</p>
        </div>

        <!-- The form itself -->
        <jsonforms
          [schema]='data.previewDataSchema'
          [renderers]='data.renderers'
          [uischema]='data.previewUiSchema'
        ></jsonforms>
      </div>
    <mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button [mat-dialog-close]="true">Close</button>
    </mat-dialog-actions>
  `
})
export class TagFormPreviewDialog {
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: TagPreviewInformation) { }
}
