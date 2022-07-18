import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'response-view-dialog',
  templateUrl: './response-view-dialog.component.html',
  styleUrls: ['./response-view-dialog.component.css']
})
export class ResponseViewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoURL: string }) { }
}
