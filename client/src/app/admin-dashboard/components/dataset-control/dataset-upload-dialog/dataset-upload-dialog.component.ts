import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { DatasetService } from '../../../../core/services/dataset.service';

/**
 * Handles the UI to allow users to add new entries to SignLab.
 */
@Component({
  selector: 'dataset-upload-dialog',
  templateUrl: './dataset-upload-dialog.component.html',
  styleUrls: ['./dataset-upload-dialog.component.css'],
})
export class DatasetUploadDialog {
  constructor(private datasetService: DatasetService) {}

  createForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    }
  );

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

    const datasetExists = await this.datasetService.datasetExists(this.name?.value);
    if (datasetExists) {
      alert('Dataset with that name already exists');
      return;
    }
  }
}
