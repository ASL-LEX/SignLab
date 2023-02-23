import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { StudyService } from '../../../core/services/study.service';
import { TagField, TagFieldType } from '../../../models/tag-field';
import { NewStudyMeta } from '../../models/new-study';
import { angularMaterialRenderers } from '@jsonforms/angular-material';

import {
  aslLexSignBankControlRendererTester,
  AslLexSignBankField
} from '../../../shared/components/custom-fields/asl-lex-field.component';
import {
  fileListControlRendererTester,
  FileListField
} from '../../../shared/components/custom-fields/file-list.component';
import { MatDialog } from '@angular/material/dialog';
import { TagFormPreviewDialog } from './tag-form-preview.component';
import { JsonSchema } from '@jsonforms/core';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import {
  VideoOptionUpload,
  videoOptionUploadRendererTester
} from '../../../shared/components/custom-fields/video-option-upload.component';
import {
  userVideoOptionRendererTester,
  UserVideoOption
} from '../../../shared/components/custom-fields/user-video-option-field.component';
import { VideoFieldComponent, videoFieldTester } from '../../../video-recording/components/video-field.component';
import { TagFieldGeneratorService } from '../../services/tag-field-generator.service';
import { OneOfField, oneOfFieldTester } from '../../../shared/components/custom-fields/one-of.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ProjectService } from '../../../core/services/project.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'new-study',
  templateUrl: './new-study.component.html',
  styleUrls: ['./new-study.component.css']
})
export class NewStudyComponent implements AfterViewInit {
  /** Used for the control of the step logic */
  @ViewChild(MatStepper) matStepper: MatStepper;
  selectedStepNumber = 1;
  maxSteps = 0;

  /** The study metadata information */
  studyMetadata: NewStudyMeta | null = null;
  /** Handles changes to study metadata */
  requiredDataChange(studyMetadata: NewStudyMeta | null) {
    this.studyMetadata = studyMetadata;
  }

  /** The selected entries' IDs that will be disabled for this study */
  markedDisabled = new Set<string>();
  /** The selected entries' IDs that will be used for training */
  markedTraining = new Set<string>();
  /** Handle changes to marked disabled */
  markedDisabledChange(newSet: Set<string>) {
    this.markedDisabled = newSet;
  }
  /** Handle changes to marked training */
  markedTrainingChange(newSet: Set<string>) {
    this.markedTraining = newSet;
  }
  /** Boolean that is updated when the study is completed */
  studyCreated = false;

  /** The fields that will be part of the tag */
  tagFields: TagField[] = [];
  /** The renderers used for the tag fields */
  renderers = [
    ...angularMaterialRenderers,
    {
      tester: aslLexSignBankControlRendererTester,
      renderer: AslLexSignBankField
    },
    { tester: fileListControlRendererTester, renderer: FileListField },
    { tester: videoOptionUploadRendererTester, renderer: VideoOptionUpload },
    { tester: userVideoOptionRendererTester, renderer: UserVideoOption },
    { tester: videoFieldTester, renderer: VideoFieldComponent },
    { tester: oneOfFieldTester, renderer: OneOfField }
  ];
  /** Possible tag options */
  tagFieldOptions = [
    { type: TagFieldType.AslLex, name: 'ASL-LEX Sign', icon: 'accessibility' },
    {
      type: TagFieldType.Autocomplete,
      name: 'Categorical',
      icon: 'text_format'
    },
    {
      type: TagFieldType.BooleanOption,
      name: 'True/False Option',
      icon: 'flag'
    },
    {
      type: TagFieldType.EmbeddedVideoOption,
      name: 'Video Option',
      icon: 'video_library'
    },
    { type: TagFieldType.FreeText, name: 'Free Text', icon: 'text_fields' },
    { type: TagFieldType.Numeric, name: 'Numeric', icon: 'bar_chart' },
    { type: TagFieldType.Slider, name: 'Slider', icon: 'tune' },
    { type: TagFieldType.VideoRecord, name: 'Record Video', icon: 'videocam' }
  ];

  constructor(
    private studyService: StudyService,
    private dialog: MatDialog,
    private router: Router,
    private tagFieldService: TagFieldGeneratorService,
    private projectService: ProjectService
  ) {}

  ngAfterViewInit(): void {
    this.maxSteps = this.matStepper.steps.length;
  }

  /** Add a field to the tag */
  async addTagField(tagFieldType: TagFieldType) {
    const field = await this.tagFieldService.getTagField(tagFieldType);
    this.tagFields.push(field);
  }

  /** Remove a field from the tag */
  removeField(index: number) {
    this.tagFields.splice(index, 1);
  }

  /** Make a new study based on form data */
  async makeNewStudy() {
    // Ensure required data filled out
    if (this.studyMetadata == null) {
      alert('Please fill in the required fields for the study');
      return;
    }

    // Ensure the study name is unique
    if (await this.studyService.studyExists(this.studyMetadata.name)) {
      alert(`The study with name ${this.studyMetadata.name} already exists`);
      return;
    }

    // Make sure there is at least one field
    if (this.tagFields.length == 0) {
      alert('Please add at least once field for the tag form');
      return;
    }

    // Ensure each field is complete and each field has a unique name
    const names = new Set<string>();
    for (const tagField of this.tagFields) {
      // Field is incomplete
      if (!tagField.isValid) {
        alert('Please completly fill out all tag fields and ensure they are valid');
        return;
      }

      // Field has a duplicated name
      if (names.has(tagField.getFieldName())) {
        alert('Ensure each field has a unique name');
        return;
      }
      names.add(tagField.getFieldName());
    }

    // Get the project ID
    const project = await firstValueFrom(this.projectService.activeProject);
    if (project == null) {
      throw new Error('No active project selected');
    }

    // Save the new study
    const schema = this.produceJSONForm();
    await this.studyService.saveStudy({
      study: {
        name: this.studyMetadata.name,
        description: this.studyMetadata.description,
        instructions: this.studyMetadata.instructions,
        tagSchema: schema
      },
      projectID: project._id!,
      trainingEntries: Array.from(this.markedTraining),
      disabledEntries: Array.from(this.markedDisabled)
    });
    this.studyCreated = true;
    this.studyService.updateStudies();
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

  redirectToAdmin() {
    this.router.navigate(['/studies/user-permissions']);
  }

  stepPrevious() {
    this.matStepper.previous();
  }

  /**
   * Handle either moving the process forward or submitting the data if
   * the last aspect of the form has been complete
   */
  stepNextOrSubmit() {
    if (this.selectedStepNumber < this.maxSteps) {
      this.matStepper.next();
    } else {
      this.makeNewStudy();
    }
  }

  stepperStepChange(event: StepperSelectionEvent) {
    this.selectedStepNumber = event.selectedIndex + 1;
  }

  /** Make the JSON Forms schema */
  private produceJSONForm(): { dataSchema: JsonSchema; uiSchema: any } {
    // Construct the data schema and UI schema
    const dataSchema: { type: string; properties: any; required: string[] } = {
      type: 'object',
      properties: {},
      required: []
    };
    const uiSchema: { type: string; elements: any[] } = {
      type: 'VerticalLayout',
      elements: []
    };

    for (const tagField of this.tagFields) {
      dataSchema.properties = {
        ...dataSchema.properties,
        ...tagField.asDataProperty()
      };
      if (tagField.isRequired()) {
        dataSchema.required.push(tagField.getFieldName());
      }
      uiSchema.elements = [...uiSchema.elements, ...tagField.asUIProperty()];
    }

    return { dataSchema: dataSchema, uiSchema: uiSchema };
  }
}
