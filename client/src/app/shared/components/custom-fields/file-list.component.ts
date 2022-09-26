import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';
import {
  Actions,
  RankedTester,
  rankWith,
  composeWithUi,
  ControlElement,
} from '@jsonforms/core';

/**
 * This component allows users to provide a series of values in the form of
 * a file upload. The file is expected to be a series of strings with each
 * value seperated by a newline.
 *
 * Example.txt
 * -------
 *  first_value
 *  second_value
 *  third_value
 *
 * The view provides a file upload button, once the user provides a file,
 * its contents will be read in.
 */
@Component({
  selector: 'file-list',
  template: `
    <div>
      <input
        type="file"
        style="display: none"
        (change)="fileSelect($event)"
        #fileUpload
      />
      <button mat-raised-button
              matTooltip="Upload options with each option on its own line"
              (click)="fileUpload.click()">
        Upload Options
      </button>
      <button mat-icon-button
              matTooltip="Download an example option list"
              (click)='downloadExample()'>
        <mat-icon>play_for_work</mat-icon>
      </button>
      <mat-error>{{ error }}</mat-error>
    </div>
  `,
})
export class FileListField extends JsonFormsControl {
  /**
   * Handles when the user selects the file. Will read in the file,
   * parse each line, remove empty string and duplicates, and trimes
   * whitespace.
   */
  fileSelect(event: any) {
    // Read in the file
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      // Extract the lines from the file
      if (fileReader.result === null) {
        return;
      }
      const lines = (fileReader.result as string).split(/\r?\n/);

      // Filter out empty lines and duplicates
      const existing = new Set<string>();
      const options = lines
        .filter((line) => {
          const shouldInclude = line.length > 0 && !existing.has(line);
          existing.add(line);
          return shouldInclude;
        })
        .map((line) => {
          return line.trim();
        });

      // Update the value of the field via the JSON Forms backend
      const path = composeWithUi(this.uischema as ControlElement, this.path);
      this.jsonFormsService.updateCore(Actions.update(path, () => options));
      this.triggerValidation();
    };
    fileReader.readAsText(file);
  }

  /**
   * Download an example file with options shown
   */
  downloadExample() {
    const data = 'Option 1\nOption 2\nOption3';

    const a = document.createElement('a');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'example-options.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

/**
 * Tester which will determine if the field should be interpreted as a
 * file-list.
 *
 * Will return true if the UI schema has an option field for "customType"
 * with a value of "file-list"
 */
export const fileListControlRendererTester: RankedTester = rankWith(
  10,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType != undefined &&
      uischema.options.customType == 'file-list'
    );
  }
);
