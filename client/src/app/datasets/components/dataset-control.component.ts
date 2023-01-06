import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetTable } from 'src/app/dataset-table/components/dataset-table.component';
import { DatasetUploadDialog } from './dataset-upload-dialog/dataset-upload-dialog.component';
import { EntryUploadDialog } from './entry-upload-dialog/entry-upload-dialog.component';

/**
 * The video control view allows Admins to view all of the currently uploaded
 * videos as well as enable/disable videos from view.
 */
@Component({
  selector: 'dataset-control',
  template: `
    <div class="entry-grid">
      <!-- Button to upload entires -->
      <button
        mat-mini-fab
        aria-label="Add a new dataset"
        (click)="openDatasetCreateDialog()"
        data-cy="createDatasetButton"
      >
        <mat-icon>add_circle</mat-icon>
      </button>
      <label>Add New Dataset</label>

      <!-- Upload entries -->
      <button
        mat-mini-fab
        aria-label="Upload Entries"
        (click)="openEntryUploadDialog()"
        data-cy="uploadEntriesButton"
      >
        <mat-icon>add_circle</mat-icon>
      </button>
      <label>Upload Entries</label>

      <dataset-table></dataset-table>
    </div>
  `,
  styles: [
    `
      button {
        margin: 1rem;
      }
    `,
    `
      .entry-grid {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      }
    `,
  ],
})
export class DatasetControlComponent {
  @ViewChild(DatasetTable) datasetTable: DatasetTable;

  constructor(private dialog: MatDialog) {}

  openDatasetCreateDialog() {
    this.dialog
      .open(DatasetUploadDialog, {
        height: '300px',
        width: '400px',
      })
      .afterClosed()
      .pipe()
      .subscribe(() => {
        this.datasetTable.loadDatasets();
      });
  }

  openEntryUploadDialog() {
    this.dialog
      .open(EntryUploadDialog, {
        height: '500px',
        width: '500px',
      })
      .afterClosed()
      .pipe()
      .subscribe(() => {
        this.datasetTable.loadDatasets();
      });
  }
}
