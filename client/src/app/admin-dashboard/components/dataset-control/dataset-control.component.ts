import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetUploadDialog } from './dataset-upload-dialog/dataset-upload-dialog.component';

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
        data-cy="uploadEntriesButton"
      >
        <mat-icon>add_circle</mat-icon>
      </button>
      <label>Add New Dataset</label>

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
  constructor(private dialog: MatDialog) {}

  openDatasetCreateDialog() {
    this.dialog
      .open(DatasetUploadDialog, {
        height: '300px',
        width: '400px',
      })
  }
}
