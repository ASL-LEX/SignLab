import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResponseUploadDialog } from './response-upload-dialog/response-upload-dialog.component';

/**
 * The video control view allows Admins to view all of the currently uploaded
 * videos as well as enable/disable videos from view.
 */
@Component({
  selector: 'response-control',
  template: `
    <div class="response-grid">
      <!-- Button to upload responses -->
      <button mat-mini-fab aria-label="Add more responses" (click)="openUploadDialog()">
        <mat-icon>add_circle</mat-icon>
      </button>
      <label>Upload Responses</label>
      <response-table></response-table>
    </div>
  `,
  styles: [
    `button { margin: 1rem;}`,
    `.response-grid { width: 100%; margin-left: auto; margin-right: auto }`
  ]
})
export class ResponseControlComponent {

  constructor(private dialog: MatDialog) { }

  openUploadDialog() {
    this.dialog.open(ResponseUploadDialog);
  }
}
