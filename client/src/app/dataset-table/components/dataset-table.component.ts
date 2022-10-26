import { Component } from '@angular/core';
import { Dataset } from 'shared/dtos/dataset.dto';
import { DatasetService } from '../../core/services/dataset.service';

/**
 * Component which wraps up displaying the different datasets with their
 * cooresponding entries.
 */
@Component({
  selector: 'dataset-table',
  template: `
    <mat-expansion-panel *ngFor="let dataset of datasets">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ dataset.name }}</mat-panel-title>
        <mat-panel-description>{{ dataset.description }}</mat-panel-description>
      </mat-expansion-panel-header>

      <entry-table [dataset]="dataset"></entry-table>
    </mat-expansion-panel>
  `,
})
export class DatasetTable {
  /** All of the available datasets */
  datasets: Dataset[] = [];

  constructor(private datasetService: DatasetService) {
    this.loadDatasets();
  }


  async loadDatasets(): Promise<void> {
    this.datasets = await this.datasetService.getDatasets();
  }
}
