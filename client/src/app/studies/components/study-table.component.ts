import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'study-table',
  templateUrl: './study-table.component.html',
  styleUrls: ['./study-table.component.css']
})
export class StudyTable {
  displayedColumns = ['name', 'description', 'delete'];

  constructor(private readonly studyService: StudyService, private readonly dialog: MatDialog) {}

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
