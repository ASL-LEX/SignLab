import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponseService } from 'src/app/services/response.service';
import { SaveAttempt } from '../../../../../../shared/dtos/response.dto';
import { ResponseUploadDialog } from './response-upload-dialog.component';

describe('ResponseUploadDialog', () => {
  const exampleError: SaveAttempt = {
    type: 'error',
    message: 'this is the message',
    where: [
      {
        place: 'Line 1',
        message: 'Line 1 bad'
      }
    ]
  };
  const exampleSuccess: SaveAttempt = {
    type: 'success'
  };

  // Representation of the event with files for testing
  const csvUpload = { target: { files: [ { } ] } };

  // Unit under test
  let responseDialog: ComponentFixture<ResponseUploadDialog>
  // Spy response service
  let responseSpy: jasmine.SpyObj<ResponseService>

  beforeEach(() => {
    responseSpy = jasmine.createSpyObj('ResponseService',
                                          [ 'uploadCSV', 'uploadZIP' ]);

    TestBed.configureTestingModule({
      declarations: [ ResponseUploadDialog ],
      providers: [
        { provide: ResponseService, useValue: responseSpy }
      ]
    });

    responseDialog = TestBed.createComponent(ResponseUploadDialog);
  });

  it('should have no errors displayed on open', () => {
    const compiled = responseDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // No message and no location errors
    expect(errorMessage.textContent).toEqual('');
    expect(errorMessage.querySelectorAll('li').length == 0);
  });

  it('should display CSV errors correctly', async () => {
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));

    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // Expected message and error location
    expect(errorMessage.textContent).toContain(exampleError.message);
    expect(compiled.querySelectorAll('ul li').length).toEqual(1);
    expect(compiled.querySelectorAll('ul li')[0].textContent).toContain(exampleError.where![0].message);
  });

  it('should not allow ZIP uploads when the CSV has not been uploaded', async () => {
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));

    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const zipButton = compiled.querySelectorAll('button')[1];
    console.log(zipButton);

    // ZIP button should be disabled
    expect(zipButton.getAttribute('disabled')).toBeDefined();
  });

  it('should have no messages on valid CSV upload', async () => {
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));

    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // No message and no location errors
    expect(errorMessage.textContent).toContain('uploaded successfully');
    expect(errorMessage.querySelectorAll('li').length == 0);
  });

  it('should allow ZIP upload after successful CSV upload', async () => {
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));

    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const zipButton = compiled.querySelectorAll('button')[1];

    expect(zipButton.getAttribute('disabled')).toBeNull();
  });

  it('should clear error messages from a failed upload after a success upload', async () => {
    // First have a failed upload
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));
    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    // CSV upload shouldn't have been considered complete
    expect(responseDialog.componentInstance.csvUploadComplete).toBeFalse();

    // Now have a successful upload
    responseSpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));
    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadCSV(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');
    const errorLocations = compiled.querySelectorAll('ul li');

    // Errors should not be shown
    expect(errorMessage.textContent).toContain('uploaded successfully');
    expect(errorLocations.length).toEqual(0);
  });

  it('should handle unsuccessful ZIP upload', async () => {
    responseSpy.uploadZIP.and.returnValue(Promise.resolve(exampleError));

    responseDialog.detectChanges();
    await responseDialog.componentInstance.uploadZIP(csvUpload);
    responseDialog.detectChanges();

    const compiled = responseDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // Expected message and error location
    expect(errorMessage.textContent).toContain(exampleError.message);
    expect(compiled.querySelectorAll('ul li').length).toEqual(1);
    expect(compiled.querySelectorAll('ul li')[0].textContent).toContain(exampleError.where![0].message);
  });
});
