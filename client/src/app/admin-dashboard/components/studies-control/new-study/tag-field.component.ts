import { Component, Input, OnInit } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { UISchemaElement, createAjv } from '@jsonforms/core';
import {
  fileListControlRendererTester,
  FileListField,
} from '../../../../shared/components/custom-fields/file-list.component';
import { TagField } from '../../../../models/tag-field';
import { VideoOptionUpload, videoOptionUploadRendererTester } from '../../../../shared/components/custom-fields/video-option-upload.component';

@Component({
  selector: 'tag-field',
  template: `
    <mat-card>
      <mat-card-title>{{ field.data.fieldName || 'Empty' }}</mat-card-title>
      <mat-card-subtitle>{{ field.kindDisplay }}</mat-card-subtitle>
      <mat-card-content>
        <jsonforms
          [data]="{}"
          [schema]="schema"
          [uischema]="uischema"
          [renderers]="renderers"
          (dataChange)="setData($event)"
          (errors)="handleErrors($event)"
          [ajv]="ajv"
        ></jsonforms>
      </mat-card-content>
    </mat-card>
  `,
})
export class TagFieldComponent implements OnInit {
  renderers = [
    ...angularMaterialRenderers,
    { tester: fileListControlRendererTester, renderer: FileListField },
    { tester: videoOptionUploadRendererTester, renderer: VideoOptionUpload },
  ];
  data: any = {};

  schema = {};
  uischema: UISchemaElement = {
    type: 'object',
  };
  ajv = createAjv({
    schemaId: 'id',
    allErrors: true,
  });

  @Input() field: TagField;

  ngOnInit(): void {
    this.schema = this.field.getDataSchema();
    this.uischema = this.field.getUISchema();
  }

  setData(data: any) {
    this.field.data = data;
  }

  handleErrors(data: any) {
    this.field.isValid = data.length == 0;
  }
}
