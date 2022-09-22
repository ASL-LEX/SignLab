import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { VideoOption } from './video-option-field.component';
import { ControlElement, Actions, composeWithUi, RankedTester, rankWith } from '@jsonforms/core';

interface CsvDataFormat {
  'Video URL': string;
  'Code': string;
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
      <mat-error>{{ error }}</mat-error>
    </div>
  `
})
export class VideoOptionUpload extends JsonFormsControl {
  constructor(
    jsonFormsService: JsonFormsAngularService,
    private csvParser: NgxCsvParser
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
          this.setValue(this.csvToVideoOption(result));
        },
        error: (error: NgxCSVParserError) => {
          console.warn('Failed to parse CSV');
          console.warn(error);

          // TODO: Pass along error to the user
        }
      })
  }

  /**
   * Set the value stored by this field
   */
  private setValue(value: VideoOption[]) {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => value));
    this.triggerValidation();
  }

  /**
   * Converts the data from the format specified in the CSV to an array
   * of VideoOption(s)
   *
   * TODO: Validate the data comes in as expected
   */
  private csvToVideoOption(results: CsvDataFormat[]): VideoOption[] {
    console.log('Results');
    console.log(results);
    return results.map(csvLine => {
      return {
        videoURL: csvLine['Video URL'],
        code: csvLine['Code'],
        searchTerm: csvLine['Search Term']
      }
    });
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
