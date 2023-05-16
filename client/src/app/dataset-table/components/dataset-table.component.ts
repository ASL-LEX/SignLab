import { Component, Inject } from '@angular/core';
import { Dataset } from '../../graphql/graphql';
import { DatasetService } from '../../core/services/dataset.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDatasetNameGQL, DatasetExistsGQL } from 'src/app/graphql/datasets/datasets.generated';
import { firstValueFrom } from 'rxjs';

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
  constructor(public datasetService: DatasetService, private readonly dialog: MatDialog,
              private readonly datasetExistsGQL: DatasetExistsGQL, private readonly changeNameGQL: ChangeDatasetNameGQL) {}

  openEditNameDialog(dataset: Dataset) {
    this.dialog.open(EditDatasetDialog, { data: { field: 'name' } }).afterClosed().subscribe(async (newName) => {
      // If no new name provided, do nothing
      if (newName === null || newName === '' || dataset.name === newName) {
        return;
      }

      // Ensure the name is unique
      const datasetWithNameExists = await firstValueFrom(this.datasetExistsGQL.fetch({ name: newName }));
      if (datasetWithNameExists.data.datasetExists) {
        alert(`A dataset with the name ${newName} already exists`);
      }

      // Update the dataset
      await firstValueFrom(this.changeNameGQL.mutate({ dataset: dataset.id, newName }));

      // Refetch the datasets for the new name to appear
      this.datasetService.updateDatasets();
    });
  }

  openEditDescriptionDialog(dataset: Dataset) {
    this.dialog.open(EditDatasetDialog, { data: { field: 'description' } }).afterClosed().subscribe((newDescription) => {
      // If no new description provided, do nothing
      if (newDescription === null || newDescription === '') {
        return;
      }
    });
  }
}

@Component({
  selector: 'dataset-edit-dialog',
  template: `
    <h1 mat-dialog-title>Change Dataset {{ data.field }}</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>New {{ data.field }}</mat-label>
        <input matInput [(ngModel)]="newValue">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button mat-button [mat-dialog-close]="newValue" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class EditDatasetDialog {
  public newValue: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { field: string }) {}
}
