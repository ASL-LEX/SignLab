import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

/**
 * Handles the UI to allow users to add new entries to SignLab.
 */
@Component({
  selector: 'dataset-upload-dialog',
  templateUrl: './dataset-upload-dialog.component.html',
  styleUrls: ['./dataset-upload-dialog.component.css'],
})
export class DatasetUploadDialog {
  createForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    }
  );
}
