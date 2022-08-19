import { Component } from '@angular/core';
import { StudyService } from '../../../../core/services/study.service';
import { TagField, TagFieldType } from '../../../../models/tag-field';
import { NewStudyMeta } from '../../../models/new-study';
import { angularMaterialRenderers } from '@jsonforms/angular-material';

import { aslLexSignBankControlRendererTester, AslLexSignBankField } from '../../../../shared/components/custom-fields/asl-lex-field.component';
import { fileListControlRendererTester, FileListField } from '../../../../shared/components/custom-fields/file-list.component';
import { MatDialog } from '@angular/material/dialog';
import { TagFormPreviewDialog } from './tag-form-preview.component';
import { JsonSchema } from '@jsonforms/core';

@Component({
  selector: 'new-study',
  templateUrl: './new-study.component.html',
  styleUrls: ['./new-study.component.css']
})
export class NewStudyComponent {
  /** The study metadata information */
  studyMetadata: NewStudyMeta | null = null;
  /** Handles changes to study metadata */
  requiredDataChange(studyMetadata: NewStudyMeta | null) { this.studyMetadata = studyMetadata; }

  /** The selected responses' IDs that will be disabled for this study */
  markedDisabled = new Set<string>();
  /** The selected responses' IDs that will be used for training */
  markedTraining = new Set<string>();
  /** Handle changes to marked disabled */
  markedDisabledChange(newSet: Set<string>) { this.markedDisabled = newSet; }
  /** Handle changes to marked training */
  markedTrainingChange(newSet: Set<string>) { this.markedTraining = newSet; }

  /** The fields that will be part of the tag */
  tagFields: TagField[] = [];
  /** The renderers used for the tag fields */
  renderers = [
    ...angularMaterialRenderers,
    { tester: aslLexSignBankControlRendererTester, renderer: AslLexSignBankField },
    { tester: fileListControlRendererTester, renderer: FileListField }
  ];
  /** Possible tag options */
  tagFieldOptions = [
    { type: TagFieldType.AslLex, name: 'ASL-LEX Sign', icon: 'accessibility' },
    { type: TagFieldType.Autocomplete, name: 'Autocomplete', icon: 'text_format' },
    { type: TagFieldType.BooleanOption, name: 'Boolean Option', icon: 'flag' },
    { type: TagFieldType.FreeText, name: 'Free Text', icon: 'text_fields' },
    { type: TagFieldType.Numeric, name: 'Numeric', icon: 'bar_chart' }
  ];

  constructor(private studyService: StudyService, private dialog: MatDialog) { }

  /** Add a field to the tag */
  addTagField(tagFieldType: TagFieldType) {
    this.tagFields.push(TagField.getTagField(tagFieldType));
  }

  /** Remove a field from the tag */
  removeField(index: number) {
    this.tagFields.splice(index, 1);
  }

  /** Make a new study based on form data */
  async makeNewStudy() {
    // Ensure required data filled out
    if(this.studyMetadata == null) {
      alert('Please fill in the required fields for the study');
      return;
    }

    // Ensure the study name is unique
    if(await this.studyService.studyExists(this.studyMetadata.name)) {
      alert(`The study with name ${this.studyMetadata.name} already exists`);
      return;
    }

    // Make sure there is at least one field
    if(this.tagFields.length == 0) {
      alert('Please add at least once field for the tag form');
      return;
    }

    // Ensure each field is complete and each field has a unique name
    const names = new Set<string>();
    for(let tagField of this.tagFields) {
      // Field is incomplete
      if(!tagField.isValid) {
        alert('Please completly fill out all tag fields');
        return;
      }

      // Field has a duplicated name
      if(names.has(tagField.getFieldName())) {
        alert('Ensure each field has a unique name');
        return;
      }
      names.add(tagField.getFieldName());
    }

    // Save the new study
    const schema = this.produceJSONForm();
    this.studyService.saveStudy({
      study: {
        name: this.studyMetadata.name,
        description: this.studyMetadata.description,
        instructions: this.studyMetadata.instructions,
        tagSchema: schema
      },
      trainingResponses: Array.from(this.markedTraining),
      disabledResponses: Array.from(this.markedDisabled)
    });
  }

  /** Display the tag form preview in a popup dialog */
  openTagFormPreview() {
    const jsonForms = this.produceJSONForm();
    this.dialog.open(TagFormPreviewDialog, {
      width: '800px',
      data: {
        previewDataSchema: jsonForms.dataSchema,
        previewUiSchema: jsonForms.uiSchema,
        renderers: this.renderers
      }
    });
  }

  /** Make the JSON Forms schema */
  private produceJSONForm(): { dataSchema: JsonSchema, uiSchema: any} {
    // Construct the data schema and UI schema
    const dataSchema: { type: string, properties: any, required: string[] } = {
      type: 'object',
      properties: { },
      required: []
    };
    const uiSchema: { type: string, elements: any[] } = {
      type: 'VerticalLayout',
      elements: []
    };

    for(let tagField of this.tagFields) {
      dataSchema.properties = {
        ...dataSchema.properties,
        ...tagField.asDataProperty()
      };
      if(tagField.isRequired()) {
        dataSchema.required.push(tagField.getFieldName());
      }
      uiSchema.elements = [
        ...uiSchema.elements,
        ...tagField.asUIProperty()
      ];
    }

    return { dataSchema: dataSchema, uiSchema: uiSchema };
  }
}
