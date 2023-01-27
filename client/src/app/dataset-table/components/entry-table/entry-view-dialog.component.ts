import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'entry-view-dialog',
  template: `
    <div>
      <video controls>
        <source src="{{ data.videoURL }}" type="video/webm" width="250" />
      </video>
    </div>
  `
})
export class EntryViewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoURL: string }) {}
}
