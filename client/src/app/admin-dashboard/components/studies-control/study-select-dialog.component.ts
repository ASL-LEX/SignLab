import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Study } from '../../../../../../shared/dtos/study.dto';

@Component({
  selector: 'study-select-dialog',
  template: `
    <mat-list>
      <!-- Header and new study -->
      <div fxLayout="row" fxLayoutAlign="space-between">
        <h2>Select a Study</h2>
        <button mat-stroked-button (click)="newStudyNav()" [mat-dialog-close]="true" *ngIf="data.newStudyOption">New Study</button>
      </div>

      <!-- List of studies -->
      <div *ngFor="let study of data.studies">
        <mat-list-item>
          <div fxLayout fxFlex>
            <!-- Indicator of selected study -->
            <div *ngIf="data.activeStudy && study._id == data.activeStudy._id; then selectIcon else placeHolder"></div>
            <ng-template #selectIcon>
              <mat-icon
                *ngIf="data.activeStudy && study._id == data.activeStudy._id"
                fxFlex="10">check</mat-icon>
            </ng-template>
            <ng-template #placeHolder>
              <span fxFlex="10"></span>
            </ng-template>

            <!-- Option to select button -->
            <button mat-stroked-button fxFlex="90" (click)="changeStudy(study)">{{ study.name }}</button>
          </div>
        </mat-list-item>
        <mat-divider></mat-divider>
      </div>
    </mat-list>
  `
})
export class StudySelectDialog {
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: { studies: Study[], activeStudy?: Study, newStudyOption: boolean },
              private router: Router,
              private dialogRef: MatDialogRef<StudySelectDialog>) { }

  /** Handle redirecting to page for making a new study */
  newStudyNav() {
    this.router.navigateByUrl('/new_study');
  }

  /** Handles selecting a study */
  changeStudy(study: Study) {
    this.dialogRef.close({ data: study });
  }
}
