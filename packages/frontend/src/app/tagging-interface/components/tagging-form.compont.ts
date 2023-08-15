import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import {
  aslLexSignBankControlRendererTester,
  AslLexSignBankField
} from '../../shared/components/custom-fields/asl-lex-field.component';
import { createAjv } from '@jsonforms/core';
import { Tag } from 'shared/dtos/tag.dto';
import {
  UserVideoOption,
  userVideoOptionRendererTester
} from '../../shared/components/custom-fields/user-video-option-field.component';
import { VideoFieldComponent, videoFieldTester } from '../../video-recording/components/video-field.component';

@Component({
  selector: 'tagging-form',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-around">
      <!-- Entry Video View -->
      <div class="video-tag-child">
        <video *ngIf="tag.entry.mediaType === 'video'" src="{{ tag.entry.mediaURL }}" controls autoplay loop></video>
        <img *ngIf="tag.entry.mediaType === 'image'" src="{{ tag.entry.mediaURL }}" />
      </div>

      <!-- Form View -->
      <div style="minWidth: 500px">
        <jsonforms
          [data]="tagData"
          [schema]="tag.study.tagSchema.dataSchema"
          [uischema]="tag.study.tagSchema.uiSchema"
          [renderers]="renderers"
          [ajv]="ajv"
          (dataChange)="formChange($event)"
          (errors)="formErrorHandler($event)"
        ></jsonforms>
        <button mat-stroked-button (click)="formSubmit()" [disabled]="!formValid">Submit</button>
      </div>
    </div>
  `
})
export class TaggingForm implements OnChanges, OnInit {
  /** The tag to complete */
  @Input() tag: Tag;
  /** Emits the tag when the tag form has been completed successfully */
  @Output() tagOutput = new EventEmitter<Tag>();
  /** The data collected in the form, the data format depends on the study */
  formData: any = {};
  /** Boolean that represents if the tag form is valid or not */
  formValid = false;
  /** Handles rendering different form fields */
  renderers = [
    ...angularMaterialRenderers,
    {
      tester: aslLexSignBankControlRendererTester,
      renderer: AslLexSignBankField
    },
    {
      tester: userVideoOptionRendererTester,
      renderer: UserVideoOption
    },
    {
      tester: videoFieldTester,
      renderer: VideoFieldComponent
    }
  ];
  /** Configure how errors are presented */
  ajv = createAjv({ schemaId: 'id', allErrors: true });
  /** Used for clearing the form */
  tagData: any = {};

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formValid = false;
  }

  /** Handles changes made in the form */
  formChange(data: any) {
    this.formData = data;
  }

  /** Handles submission of the form */
  formSubmit() {
    if (this.formValid) {
      this.tag.info = this.formData;
      this.tagOutput.emit(this.tag);
    }
  }

  /** Handles in coming errors */
  formErrorHandler(errors: any[]) {
    this.formValid = errors.length == 0;
    this.changeDetector.detectChanges();
  }

  /** Handles when the tag changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.tag) {
      this.tag = changes.tag.currentValue;
      this.tagData = {};
    }
  }
}
