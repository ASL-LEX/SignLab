import { Component, Output, EventEmitter } from '@angular/core';
import { DatasetService } from '../../core/services/dataset.service';
import { Dataset } from '../../graphql/graphql';

/**
 * Component for controlling which entries will be part of a study
 */
@Component({
  selector: 'dataset-new-study-table',
  template: `
    <div *ngIf="datasetService.datasets | async as datasets">
      <mat-expansion-panel *ngFor="let dataset of datasets">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ dataset.name }}</mat-panel-title>
          <mat-panel-description>{{
            dataset.description
          }}</mat-panel-description>
        </mat-expansion-panel-header>

        <entry-new-study
          [dataset]="dataset"
          (markedDisabledChange)="markedDisabledChange.emit($event)"
          (markedTrainingChange)="markedTrainingChange.emit($event)"
        ></entry-new-study>
      </mat-expansion-panel>
    </div>
  `,
})
export class DatasetNewStudy {
  /** Aggregated set of all entries that will not be part of the tagging */
  @Output() markedDisabledChange = new EventEmitter<Set<string>>();
  /** Aggregated set of all entries that will be used for training */
  @Output() markedTrainingChange = new EventEmitter<Set<string>>();

  constructor(public datasetService: DatasetService) {}
}
