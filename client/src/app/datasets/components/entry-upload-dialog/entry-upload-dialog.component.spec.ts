import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryService } from '../../../../core/services/entry.service';
import { SaveAttempt } from 'shared/dtos/entry.dto';
import { EntryUploadDialog } from './entry-upload-dialog.component';
import { DatasetService } from '../../../../core/services/dataset.service';
import { AuthService } from '../../../../core/services/auth.service';

describe('EntryUploadDialog', () => {
  const exampleError: SaveAttempt = {
    type: 'error',
    message: 'this is the message',
    where: [
      {
        place: 'Line 1',
        message: 'Line 1 bad',
      },
    ],
  };
  const exampleSuccess: SaveAttempt = {
    type: 'success',
  };

  // Representation of the event with files for testing
  const csvUpload = { target: { files: [{}] } };

  // Unit under test
  let entryDialog: ComponentFixture<EntryUploadDialog>;
  // Spy entry service
  let entrySpy: jasmine.SpyObj<EntryService>;
  let datasetService: jasmine.SpyObj<DatasetService>;

  const testUser = {
    _id: '1',
    name: 'test',
    username: 'test',
    email: '',
    roles: {
      admin: true,
      tagging: false,
      accessing: false,
      owner: false,
      recording: false,
    },
  };

  beforeEach(() => {
    entrySpy = jasmine.createSpyObj('EntryService', [
      'uploadCSV',
      'uploadZIP',
      'setTargetUser',
      'setTargetDataset',
    ]);
    datasetService = jasmine.createSpyObj('DatasetService', ['getDatasets']);
    datasetService.getDatasets.and.returnValue(
      Promise.resolve([
        {
          _id: '1',
          name: 'test',
          description: 'test',
          creator: testUser,
        },
      ])
    );
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      users: testUser,
    });

    TestBed.configureTestingModule({
      declarations: [EntryUploadDialog],
      providers: [
        { provide: EntryService, useValue: entrySpy },
        { provide: DatasetService, useValue: datasetService },
        { provide: AuthService, useValue: authSpy },
      ],
    });

    entryDialog = TestBed.createComponent(EntryUploadDialog);
  });

  it('should have no errors displayed on open', () => {
    const compiled = entryDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // No message and no location errors
    expect(errorMessage.textContent).toEqual('');
    expect(errorMessage.querySelectorAll('li').length == 0);
  });

  it('should display CSV errors correctly', async () => {
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));

    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // Expected message and error location
    expect(errorMessage.textContent).toContain(exampleError.message);
    expect(compiled.querySelectorAll('ul li').length).toEqual(1);
    expect(compiled.querySelectorAll('ul li')[0].textContent).toContain(
      exampleError.where![0].message
    );
  });

  it('should not allow ZIP uploads when the CSV has not been uploaded', async () => {
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));

    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const zipButton = compiled.querySelectorAll('button')[1];
    console.log(zipButton);

    // ZIP button should be disabled
    expect(zipButton.getAttribute('disabled')).toBeDefined();
  });

  it('should have no messages on valid CSV upload', async () => {
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));

    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // No message and no location errors
    expect(errorMessage.textContent).toContain('uploaded successfully');
    expect(errorMessage.querySelectorAll('li').length == 0);
  });

  it('should allow ZIP upload after successful CSV upload', async () => {
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));

    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const zipButton = compiled.querySelectorAll('button')[1];

    expect(zipButton.getAttribute('disabled')).toBeNull();
  });

  it('should clear error messages from a failed upload after a success upload', async () => {
    // First have a failed upload
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleError));
    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    // CSV upload shouldn't have been considered complete
    expect(entryDialog.componentInstance.csvUploadComplete).toBeFalse();

    // Now have a successful upload
    entrySpy.uploadCSV.and.returnValue(Promise.resolve(exampleSuccess));
    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadCSV(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');
    const errorLocations = compiled.querySelectorAll('ul li');

    // Errors should not be shown
    expect(errorMessage.textContent).toContain('uploaded successfully');
    expect(errorLocations.length).toEqual(0);
  });

  it('should handle unsuccessful ZIP upload', async () => {
    entrySpy.uploadZIP.and.returnValue(Promise.resolve(exampleError));

    entryDialog.detectChanges();
    await entryDialog.componentInstance.uploadZIP(csvUpload);
    entryDialog.detectChanges();

    const compiled = entryDialog.debugElement.nativeElement;
    const errorMessage = compiled.querySelector('p');

    // Expected message and error location
    expect(errorMessage.textContent).toContain(exampleError.message);
    expect(compiled.querySelectorAll('ul li').length).toEqual(1);
    expect(compiled.querySelectorAll('ul li')[0].textContent).toContain(
      exampleError.where![0].message
    );
  });
});
