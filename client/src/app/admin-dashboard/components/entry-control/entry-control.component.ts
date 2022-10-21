import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntryTable } from '../../../entry-table/components/entry-table.component';
import { EntryUploadDialog } from './entry-upload-dialog/entry-upload-dialog.component';

/**
 * The video control view allows Admins to view all of the currently uploaded
 * videos as well as enable/disable videos from view.
 */
@Component({
  selector: 'entry-control',
  template: `
    <div class="entry-grid">
      <!-- Button to upload entires -->
      <button
        mat-mini-fab
        aria-label="Add more entires"
        (click)="openUploadDialog()"
        data-cy="uploadEntriesButton"
      >
        <mat-icon>add_circle</mat-icon>
      </button>
      <label>Upload Entries</label>
      <entry-table></entry-table>
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
export class EntryControlComponent {
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
