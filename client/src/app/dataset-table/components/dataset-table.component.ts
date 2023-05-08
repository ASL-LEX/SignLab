import { Component, Inject } from '@angular/core';
import { Dataset } from '../../graphql/graphql';
import { DatasetService } from '../../core/services/dataset.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
          <mat-panel-title>
            {{ dataset.name }}
            <button mat-mini-fab aria-label="Edit Name" (click)="openEditNameDialog(dataset)" style="transform: scale(0.75)">
              <mat-icon style="transform: scale(0.75)">edit</mat-icon>
            </button>
          </mat-panel-title>
          <mat-panel-description>
            {{ dataset.description }}
            <button mat-mini-fab aria-label="Edit Name" (click)="openEditDescriptionDialog(dataset)" style="transform: scale(0.75)">
              <mat-icon style="transform: scale(0.75)">edit</mat-icon>
            </button>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <entry-table [dataset]="dataset"></entry-table>
      </mat-expansion-panel>
    </div>
  `
})
export class DatasetTable {
  constructor(public datasetService: DatasetService, private readonly dialog: MatDialog) {}

  openEditNameDialog(dataset: Dataset) {
    this.dialog.open(EditDatasetDialog, { data: { field: 'name' } });
  }

  openEditDescriptionDialog(dataset: Dataset) {
    this.dialog.open(EditDatasetDialog, { data: { field: 'description' } });
  }
}

@Component({
  selector: 'dataset-edit-dialog',
  template: `
    <mat-dialog-content>
      <mat-dialog-title>Change Dataset {{ data.field }}</mat-dialog-title>
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>New {{ data.field }}</mat-label>
          <input matInput [(ngModel)]="newValue">
        </mat-form-field>
      </mat-dialog-content>
    </mat-dialog-content>
  `
})
export class EditDatasetDialog {
  public newValue: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { file: string }) {}
}
