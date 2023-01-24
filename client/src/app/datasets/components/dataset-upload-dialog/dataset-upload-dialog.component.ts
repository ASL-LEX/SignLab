import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DatasetService } from '../../../core/services/dataset.service';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Handles the UI to allow users to add new entries to SignLab.
 */
@Component({
  selector: 'dataset-upload-dialog',
  templateUrl: './dataset-upload-dialog.component.html',
  styleUrls: ['./dataset-upload-dialog.component.css'],
})
export class DatasetUploadDialog {
  constructor(
    private datasetService: DatasetService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DatasetUploadDialog>
  ) {}

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  get name() {
    return this.createForm.get('name');
  }

  get description() {
    return this.createForm.get('description');
  }

  async onSubmit() {
    if (this.name === null || this.name.value === null) {
      return; // Nothing to submit, should not reach here with proper Validators
    }

    const datasetExists = await this.datasetService.datasetExists(
      this.name?.value
    );
    if (datasetExists) {
      alert('Dataset with that name already exists');
      return;
    }

    const dataset = {
      name: this.name!.value!,
      description: this.description!.value!,
      creatorID: this.authService.user._id,
    };

    this.datasetService.createDataset(dataset);
    this.dialogRef.close();
  }
}
