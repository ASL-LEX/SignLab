import { Component } from '@angular/core';
import { ResponseService } from '../../../../core/services/response.service';
import { LocationInfo } from 'shared/dtos/response.dto';

/**
 * Handles the UI to allow users to add new responses to SignLab.
 */
@Component({
  selector: 'response-upload-dialog',
  templateUrl: './response-upload-dialog.component.html',
  styleUrls: ['./response-upload-dialog.component.css'],
})
export class ResponseUploadDialog {
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

  constructor(private responseService: ResponseService) {
    this.csvUploadComplete = false;
    this.uploadStatusMessage = '';
    this.errorLocations = [];
  }

  async uploadCSV(event: any) {
    const result = await this.responseService.uploadCSV(event.target.files[0]);

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
    }
  }

  async uploadZIP(event: any) {
    const result = await this.responseService.uploadZIP(event.target.files[0]);

    // Upload status message displayed to user
    if (result.type != 'success') {
      this.uploadStatusMessage = result.message!;
      this.errorLocations = result.where ? result.where : [];

      // Clear input field to allow for another upload attempt
      event.target.value = '';
    } else {
      this.uploadStatusMessage =
        'Response uploaded successfully, reload page to see new responses';
      this.errorLocations = [];
    }
  }
}
