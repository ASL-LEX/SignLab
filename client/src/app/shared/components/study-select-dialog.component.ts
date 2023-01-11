import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

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
    // Update the list of options when the studies change
    this.studyService.getStudiesForActiveProject().then((studies) => {
      this.updateStudyOptions(studies);
    });

    // Update the active ID when the active study changes
    this.studyService.activeStudy.subscribe((study) => {
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
