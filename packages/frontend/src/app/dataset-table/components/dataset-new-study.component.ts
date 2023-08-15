import { Component, Output, EventEmitter } from '@angular/core';
import { DatasetService } from '../../core/services/dataset.service';

/**
 * Component for controlling which entries will be part of a study
 */
@Component({
  selector: 'dataset-new-study-table',
  template: `
    <div *ngIf="datasetService.visibleDatasets | async as datasets">
      <div *ngIf="datasets.length == 0; else datasetView">
        <mat-card>
          <mat-card-title>No Datasets Available to this Project</mat-card-title>
          <mat-card-content>
            Have an administrator grant this project access to a dataset to select training values. You can create the
            study and later grant dataset access, doing so however will mean this study will not have a training set.
          </mat-card-content>
        </mat-card>
      </div>
      <ng-template #datasetView>
        <mat-expansion-panel *ngFor="let dataset of datasets">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ dataset.name }}</mat-panel-title>
            <mat-panel-description>{{ dataset.description }}</mat-panel-description>
          </mat-expansion-panel-header>

          <entry-new-study
            [dataset]="dataset"
            (markedDisabledChange)="markedDisabledChange.emit($event)"
            (markedTrainingChange)="markedTrainingChange.emit($event)"
          ></entry-new-study>
        </mat-expansion-panel>
      </ng-template>
    </div>
  `
})
export class DatasetNewStudy {
  /** Aggregated set of all entries that will not be part of the tagging */
  @Output() markedDisabledChange = new EventEmitter<Set<string>>();
  /** Aggregated set of all entries that will be used for training */
  @Output() markedTrainingChange = new EventEmitter<Set<string>>();

  constructor(public datasetService: DatasetService) {}
}
