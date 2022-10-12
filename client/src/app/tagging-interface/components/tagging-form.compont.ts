import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import {
  aslLexSignBankControlRendererTester,
  AslLexSignBankField,
} from '../../shared/components/custom-fields/asl-lex-field.component';
import { createAjv } from '@jsonforms/core';
import { Tag } from 'shared/dtos/tag.dto';
import {
  UserVideoOption,
  userVideoOptionRendererTester,
} from '../../shared/components/custom-fields/user-video-option-field.component';
import { VideoFieldComponent, videoFieldTester } from '../../video-recording/components/video-field.component';

@Component({
  selector: 'tagging-form',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-around">
      <!-- Entry Video View -->
      <div class="video-tag-child">
        <video src="{{ tag.entry.videoURL }}" controls autoplay loop></video>
      </div>

      <!-- Form View -->
      <div class="video-tag-child">
        <jsonforms
          [data]="tagData"
          [schema]="TEST_DATA_SCHEMA"
          [uischema]="TEST_UI_SCHEMA"
          [renderers]="renderers"
          [ajv]="ajv"
          (dataChange)="formChange($event)"
          (errors)="formErrorHandler($event)"
        ></jsonforms>
        <button
          mat-stroked-button
          (click)="formSubmit()"
          [disabled]="!formValid"
        >
          Submit
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .video-tag-container {
        padding: 20px;
      }
    `,
    `
      .video-tag-child {
        width: 50%;
        float: left;
        padding: 20px;
      }
    `,
  ],
})
export class TaggingForm implements OnChanges {
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
      renderer: AslLexSignBankField,
    },
    {
      tester: userVideoOptionRendererTester,
      renderer: UserVideoOption,
    },
    {
      tester: videoFieldTester,
      renderer: VideoFieldComponent,
    },
  ];
  /** Configure how errors are presented */
  ajv = createAjv({ schemaId: 'id', allErrors: true });
  /** Used for clearing the form */
  tagData: any = {};

  // TODO: Remove these after testing
  TEST_DATA_SCHEMA = {
    type: 'object',
    properties: {
      entryA: {
        type: 'string',
        description: 'The entry video',
      },
      entryB: {
        type: 'string',
        description: 'The entry video',
      },
    },
  };

  TEST_UI_SCHEMA = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/entryA',
        options: {
          customType: 'video'
        }
      },
      {
        type: 'Control',
        scope: '#/properties/entryB',
        options: {
          customType: 'video'
        }
      }
    ]
  };


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
  }

  /** Handles when the tag changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.tag) {
      this.tag = changes.tag.currentValue;
      this.tagData = {};
    }
  }
}
