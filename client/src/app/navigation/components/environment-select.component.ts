import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'environment-select',
  template: `
    <mat-card class="study-select-card">
      <mat-card-header>
        <mat-card-title>Environment</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- Project Select -->
        <div fxlayout="row" fxLayoutAlign="center" class="environment-select">
          <p>Project: </p>
          <mat-select class="select-field" placeholder="No Project Selected">
            <mat-option [value]="1">Project A</mat-option>
            <mat-option [value]="2">Project B</mat-option>
          </mat-select>
        </div>

        <!-- Study Select -->
        <div fxLayout="row" fxLayoutAlign="center" class="environment-select">
          <p>Study:</p>
          <mat-select
            class="select-field"
            placeholder="No Study Selected"
            *ngIf="studyService.studies | async as studies; else noStudies"
            (selectionChange)="studySelect($event)"
            [value]="(studyService.activeStudy | async)?._id || ''"
          >
            <mat-option *ngFor="let study of studies" [value]="study._id">
              {{ study.name }}
            </mat-option>
          </mat-select>

          <!-- Displayed when no studies are available to select from -->
          <ng-template #noStudies>
            <p>No Studies Available</p>
          </ng-template>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./environment-select.component.css'],
})
export class EnvironmentSelect {
  constructor(public studyService: StudyService) {}

  /** Update the study that is active */
  studySelect(event: MatSelectChange): void {
    this.studyService.setActiveStudy(event.value);
  }
}
