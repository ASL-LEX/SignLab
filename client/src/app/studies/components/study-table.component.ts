import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'study-table',
  templateUrl: './study-table.component.html',
  styleUrls: ['./study-table.component.css']
})
export class StudyTable {
  displayedColumns = ['name', 'description', 'delete'];

  constructor(public readonly studyService: StudyService, private readonly dialog: MatDialog) {}

  handleDeletion(study: Study) {
    const ref = this.dialog.open(ConfirmationDialog, {
      width: '800px',
      data: study
    });

    ref.afterClosed().subscribe(async (shouldDelete) => {
      if (shouldDelete) {
        await this.studyService.deleteStudy(study);
      }
    });
  }

  openEditNameDialog(study: Study) {
    this.dialog
      .open(EditStudyDialog, { data: { field: 'name' } })
      .afterClosed()
      .subscribe(async (newName) => {

      });
  }

  openEditDescriptionDialog(study: Study) {
    this.dialog
      .open(EditStudyDialog, { data: { field: 'description' } })
      .afterClosed()
      .subscribe(async (newDescription) => {

      });
  }
}

@Component({
  selector: 'delete-study-dialog',
  template: `
    <h1 mat-dialog-title>Delete: {{ study.name }}</h1>
    <div mat-dialog-content>
      Deleting a study will remove all cooresponding tags and remove the relation between entries recorded as part of
      the study and the source tag. Entries recorded as part of this study will not be deleted. Are you sure you want to
      delete the study?
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button [mat-dialog-close]="true" cdkFocusInitial>Yes Delete</button>
    </div>
  `
})
export class ConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public study: Study) {}
}

@Component({
  selector: 'study-edit-dialog',
  template: `
    <h1 mat-dialog-title>Change Study {{ data.field }}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>New {{ data.field }}</mat-label>
        <input matInput [(ngModel)]="newValue" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button mat-button [mat-dialog-close]="newValue" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class EditStudyDialog {
  public newValue = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { field: string }) {}
}
