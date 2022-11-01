import { Component, Input } from '@angular/core';
import { Dataset } from 'shared/dtos/dataset.dto';
import { Study } from 'shared/dtos/study.dto';
import { DatasetService } from '../../core/services/dataset.service';

/**
 * Component that allows for displaying and controlling entries on
 * a per study basis.
 */
@Component({
  selector: 'dataset-study-table',
  template: `
    <mat-expansion-panel *ngFor="let dataset of datasets">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ dataset.name }}</mat-panel-title>
        <mat-panel-description>{{ dataset.description }}</mat-panel-description>
      </mat-expansion-panel-header>

      <entry-study-table
        [dataset]="dataset"
        [study]="study"
      ></entry-study-table>
    </mat-expansion-panel>
  `,
})
export class DatasetStudyTable {
  /** The study to display the entries for */
  @Input() study: Study | null = null;
  /** The datasets that are available */
  datasets: Dataset[] = [];

  constructor(datasetService: DatasetService) {
    // Get the datasets
    datasetService.getDatasets().then((datasets) => {
      this.datasets = datasets;
    });
  }
}
