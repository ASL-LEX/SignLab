import { ChangeDetectorRef, Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { VideoOption } from './video-option-field.component';
import {
  ControlElement,
  Actions,
  composeWithUi,
  RankedTester,
  rankWith,
} from '@jsonforms/core';

interface CsvDataFormat {
  'Video URL': string;
  Code: string;
  'Search Term': string;
}

/**
 * This component handles user uploads of a CSV that have video options
 * included.
 *
 * Example.csv
 * -----------
 * Video URL,Code,Search Term
 * www.example.com/video1,ABCD,bread
 * www.example.com/video1,ABCE,flower
 *
 * The view provides a file upload button, once the user provides a file, its
 * contents will be read in.
 */
@Component({
  selector: 'video-file-options',
  template: `
    <div>
      <input
        type="file"
        style="display: none"
        (change)="fileSelect($event)"
        #fileUpload
      />
      <button mat-raised-button (click)="fileUpload.click()">
        Upload Video Options
      </button>
      <button
        mat-icon-button
        matTooltip="Download an example option list"
        (click)="downloadExample()"
      >
        <mat-icon>play_for_work</mat-icon>
      </button>
      <mat-error>{{ error }}</mat-error>
    </div>
  `,
})
export class VideoOptionUpload extends JsonFormsControl {
  constructor(
    jsonFormsService: JsonFormsAngularService,
    private csvParser: NgxCsvParser,
    private changeDetect: ChangeDetectorRef
  ) {
    super(jsonFormsService);
  }

  /**
   * Handles parsing the provided file.
   */
  fileSelect(event: any) {
    // Read in the file
    const file = event.target.files[0];

    // Parse the CSV
    this.csvParser
      .parse(file, { header: true })
      .pipe()
      .subscribe({
        next: (result: any) => {
          try {
            const videoOptions = this.csvToVideoOption(result);
            this.setValue(videoOptions);
          } catch (error: any) {
            console.warn('Failed to parse CSV, invalid data provided');
            console.warn(error);
            this.changeDetect.detectChanges();
          }
        },
        error: (error: NgxCSVParserError) => {
          console.warn('Failed to parse CSV');
          console.warn(error);

          // TODO: Pass along error to the user
        },
      });
  }

  /**
   * Set the value stored by this field
   */
  private setValue(value: VideoOption[] | undefined) {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => value));
    this.triggerValidation();
  }

  /**
   * Converts the data from the format specified in the CSV to an array
   * of VideoOption(s)
   *
   * NOTE: This will also handle the validation logic. The internal
   *       `error` property which is used for JSON Forms validation will
   *       be updated
   */
  private csvToVideoOption(csvData: CsvDataFormat[]): VideoOption[] {
    // Clear out any pre-existing errors
    this.error = null;

    const results: VideoOption[] = [];
    for (const csvLine of csvData) {
      // Ensure each field is present
      if (!csvLine['Video URL']) {
        this.error = 'Missing column "Video URL"';
      }
      if (!csvLine['Code']) {
        this.error = 'Missing column "Code"';
      }
      if (!csvLine['Search Term']) {
        this.error = 'Missing column "Search Term"';
      }

      // If any error took place, throw the error
      if (this.error) {
        throw new Error(this.error);
      }

      // Otherwise add to the list of results
      results.push({
        videoURL: csvLine['Video URL'],
        code: csvLine['Code'],
        searchTerm: csvLine['Search Term'],
      });
    }

    return results;
  }

  /**
   * Download an example file with options shown
   */
  downloadExample() {
    let data = 'Video URL,Code,Search Term\n';
    data +=
      'https://player.vimeo.com/video/344216753?title=0&byline=0&portrait=0?&loop=1&autoplay=1&controls=0&background=1,A-1,cat';

    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'video-options.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

/**
 * Tester which is used to determine if the VideoOptionUpload should be the
 * field to use in the form
 */
export const videoOptionUploadRendererTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType != undefined &&
      uischema.options.customType == 'video-option-upload'
    );
  }
);
