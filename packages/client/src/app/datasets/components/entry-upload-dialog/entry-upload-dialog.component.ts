import { Component } from '@angular/core';
import { EntryService } from '../../../core/services/entry.service';
import { LocationInfo } from 'shared/dtos/entry.dto';
import { ManualControl } from '../../../shared/helpers/manual-control';
import { Dataset } from '../../../graphql/graphql';
import { MatSelectChange } from '@angular/material/select';
import { DatasetService } from '../../../core/services/dataset.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Handles the UI to allow users to add new entries to SignLab.
 */
@Component({
  selector: 'entry-upload-dialog',
  templateUrl: './entry-upload-dialog.component.html',
  styleUrls: ['./entry-upload-dialog.component.css']
})
export class EntryUploadDialog {
  /**
   * Represents if the CSV has been uploaded successfully, controls if
   * the user can upload a zip yet
   */
  csvUploadComplete: boolean;
  /**
   * Stores the error message that was generated by the last upload attempt
   */
  uploadStatusMessage: string;
  /**
   * Array of potential locations of errors to display to the user
   */
  errorLocations: LocationInfo[];
  /**
   * Control which represents if the user has selected a valid dataset
   */
  datasetSelectControl = new ManualControl();
  /**
   * Control which represents if the user has uploaded valid metadata
   */
  metadataUploadControl = new ManualControl();
  /**
   * Control which represents if the user has uploaded valid videos
   */
  videoUploadControl = new ManualControl();
  /**
   * The dataset that was selected
   */
  dataset: Dataset | null = null;

  constructor(
    private entryService: EntryService,
    public datasetService: DatasetService,
    private authService: AuthService
  ) {
    this.csvUploadComplete = false;
    this.uploadStatusMessage = '';
    this.errorLocations = [];
    this.datasetSelectControl.markAsInvalid();
  }

  async datasetSelection(dataset: MatSelectChange) {
    this.dataset = dataset.value;
    this.datasetSelectControl.markAsValid();
  }

  /** Used in the select panel to display the dataset name */
  selectCompareWith(a: Dataset, b: Dataset) {
    if (a == null || b == null) {
      return false;
    }
    return a.id === b.id;
  }

  async uploadCSV(event: any) {
    const result = await this.entryService.uploadCSV(event.target.files[0]);

    this.entryService.setTargetUser(this.authService.user);
    this.entryService.setTargetDataset(this.dataset!);

    // Update status message displayed to user
    if (result.type != 'success') {
      this.uploadStatusMessage = result.message!;
      this.errorLocations = result.where ? result.where : [];

      // Clear input field to allow for another upload attempt
      event.target.value = '';
    } else {
      this.uploadStatusMessage = 'CSV uploaded successfully';
      this.errorLocations = [];
    }

    // As long as the result wasn't an error, can upload the ZIP
    if (result.type != 'error') {
      this.csvUploadComplete = true;
      this.metadataUploadControl.markAsValid();
    }
  }

  async uploadZIP(event: any) {
    const result = await this.entryService.uploadZIP(event.target.files[0]);

    // Upload status message displayed to user
    if (result.type != 'success') {
      this.uploadStatusMessage = result.message!;
      this.errorLocations = result.where ? result.where : [];

      // Clear input field to allow for another upload attempt
      event.target.value = '';
    } else {
      this.uploadStatusMessage = 'Entry uploaded successfully, reload page to see new entries';
      this.errorLocations = [];
    }
  }

  /**
   * Download the template for the entries
   */
  async downloadCSVTemplate() {
    const header = await this.entryService.getCSVHeader();

    const a = document.createElement('a');
    const blob = new Blob([header], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'entry-upload-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}