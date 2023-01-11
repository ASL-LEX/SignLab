import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  studyOptions: SelectDialogOptions[];
  studies: Study[];
  activeStudyID = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      activeStudy?: Study;
      newStudyOption: boolean;
    },
    private router: Router,
    private dialogRef: MatDialogRef<StudySelectDialog>,
    private studyService: StudyService
  ) {
    this.studyService.getStudiesForActiveProject().then((studies) => {
      this.studies = studies;
      this.studyOptions = studies.map(study => {
        return {
          name: study.name,
          value: study._id!,
        };
      });
    });
    this.studyService.activeStudy.subscribe((study) => {
      if (study === null) {
        throw new Error('No active study');
      }
      this.activeStudyID = study._id!;
    });
  }

  /** Handle redirecting to page for making a new study */
  newStudyNav() {
    this.router.navigateByUrl('/new_study');
  }

  /** Handles selecting a study */
  changeStudy(studyOption: SelectDialogOptions) {
    console.log(studyOption);
    const study = this.studies.find((study) => study._id! === studyOption.value);
    if (!study) {
      throw new Error('Study not found');
    }

    this.studyService.setActiveStudy(study);
    this.dialogRef.close({ data: study });
  }
}
