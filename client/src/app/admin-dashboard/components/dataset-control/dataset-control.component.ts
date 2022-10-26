import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntryTable } from '../../../dataset-table/components/entry-table/entry-table.component';
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
        (click)="openUploadDialog()"
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
  @ViewChild(EntryTable) entryTableView: EntryTable;

  constructor(private dialog: MatDialog) {}

  openUploadDialog() {
    this.dialog
      .open(EntryUploadDialog, {
        height: '400px',
        width: '2000px',
      })
      .afterClosed()
      .subscribe(() => {
        this.entryTableView.loadEntries();
      });
  }
}
