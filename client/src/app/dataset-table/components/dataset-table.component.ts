import { Component } from '@angular/core';
import { DatasetService } from '../../core/services/dataset.service';

/**
 * Component which wraps up displaying the different datasets with their
 * cooresponding entries.
 */
@Component({
  selector: 'dataset-table',
  template: `
    <div *ngIf="datasetService.datasets | async as datasets">
      <mat-expansion-panel *ngFor="let dataset of datasets">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ dataset.name }}</mat-panel-title>
          <mat-panel-description>{{
            dataset.description
          }}</mat-panel-description>
        </mat-expansion-panel-header>

        <entry-table [dataset]="dataset"></entry-table>
      </mat-expansion-panel>
    </div>
  `,
})
export class DatasetTable {
  constructor(public datasetService: DatasetService) {}
}
