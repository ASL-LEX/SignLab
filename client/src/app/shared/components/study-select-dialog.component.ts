import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';
import { firstValueFrom } from 'rxjs';

/**
 * Dialog which provides an interface for selecting the study to view.
 * This will update the study in the study service.
 */
import { SelectDialogOptions } from './selector-dialog.component';

@Component({
  selector: 'study-select-dialog',
  template: `
    <selector-dialog
      [header]="'Select Study'"
      [options]="studyOptions"
      [(selected)]="activeStudyID"
      (selectedChange)="changeStudy($event)"
    ></selector-dialog>
  `,
})
export class StudySelectDialog {
  /** The options the user can select from */
  studyOptions: SelectDialogOptions[];
  /** The studies themselves, searched through via ID */
  studies: Study[];
  /** The active study ID, for rendering to the user the current selection */
  activeStudyID = '';

  constructor(
    private dialogRef: MatDialogRef<StudySelectDialog>,
    private studyService: StudyService
  ) {
    // Generate the study list
    this.studyService.getStudiesForActiveProject().then((studies) => {
      this.updateStudyOptions(studies);
    });

    // Determine the current active study
    firstValueFrom(this.studyService.activeStudy).then((study) => {
      this.activeStudyID = study ? study._id! : '';
    });
  }

  /** Handles selecting a study */
  changeStudy(studyOption: SelectDialogOptions) {
    const study = this.studies.find((study) => study._id! === studyOption.value);
    if (!study) {
      throw new Error('Study not found');
    }

    this.studyService.setActiveStudy(study);
    this.dialogRef.close({ data: study });
  }

  /** Update the list of options based on the new studies */
  private updateStudyOptions(studies: Study[]) {
    this.studies = studies;
    this.studyOptions = studies.map((study) => {
      return {
        name: study.name,
        value: study._id!,
      };
    });
  }
}
