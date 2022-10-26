import { Component } from '@angular/core';
import { Dataset } from 'shared/dtos/dataset.dto';

/**
 * Component which wraps up displaying the different datasets with their
 * cooresponding entries.
 */
@Component({
  selector: 'dataset-table',
  template: `
  <div>
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Dataset A</mat-panel-title>
        <mat-panel-description>Collection of animals</mat-panel-description>
      </mat-expansion-panel-header>

      <entry-table></entry-table>
    </mat-expansion-panel>

    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Dataset B</mat-panel-title>
        <mat-panel-description>Collection of locations</mat-panel-description>
      </mat-expansion-panel-header>

      <entry-table></entry-table>
    </mat-expansion-panel>
  </div>
  `,
})
export class DatasetTable {
  /** All of the available datasets */
  datasets: Dataset[] = [];
}
