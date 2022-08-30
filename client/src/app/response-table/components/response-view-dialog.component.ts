import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'response-view-dialog',
  template: `
    <div>
      <video controls>
        <source src="{{ data.videoURL }}" type="video/webm" width="250" />
      </video>
    </div>
  `,
})
export class ResponseViewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoURL: string }) {}
}
