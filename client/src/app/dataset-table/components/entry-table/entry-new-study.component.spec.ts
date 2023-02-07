import { EntryService } from '../../../core/services/entry.service';
import { Entry } from 'shared/dtos/entry.dto';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EntryNewStudyTable } from './entry-new-study.component';
import { SharedModule } from '../../../shared/shared.module';
import { EntryTableCoreComponent } from './entry-table-core.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'shared/dtos/user.dto';
import { Dataset } from 'shared/dtos/dataset.dto';

describe('EntryNewStudyTable', () => {
  const creator: User = {
    _id: '1',
    name: 'test',
    username: 'test',
    email: '',
    roles: {
      owner: false,
      studyContributor: new Map<string, boolean>(),
      projectAdmin: new Map<string, boolean>(),
      studyAdmin: new Map<string, boolean>(),
      studyVisible: new Map<string, boolean>()
    }
  };

  const dataset: Dataset = {
    _id: '1',
    name: 'test',
    description: 'test',
    creator: creator
  };

  const exampleEntryData: Entry[] = [
    {
      _id: '1',
      entryID: '1',
      mediaURL: 'video',
      mediaType: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
      creator: creator,
      dateCreated: new Date(),
      dataset: dataset
    },
    {
      _id: '2',
      entryID: '1',
      mediaURL: 'video',
      mediaType: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
      creator: creator,
      dateCreated: new Date(),
      dataset: dataset
    },
    {
      _id: '3',
      entryID: '1',
      mediaURL: 'video',
      mediaType: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
      creator: creator,
      dateCreated: new Date(),
      dataset: dataset
    },
    {
      _id: '4',
      entryID: '1',
      mediaURL: 'video',
      mediaType: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
      creator: creator,
      dateCreated: new Date(),
      dataset: dataset
    }
  ];

  // Entry service spy to serve fake data
  let entrySpy: jasmine.SpyObj<EntryService>;
  // Test component
  let entryTable: ComponentFixture<EntryNewStudyTable>;

  beforeEach(fakeAsync(() => {
    entrySpy = jasmine.createSpyObj('EntryService', ['getEntriesForDataset']);
    entrySpy.getEntriesForDataset.and.returnValue(Promise.resolve(exampleEntryData));

    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule],
      declarations: [EntryNewStudyTable, EntryTableCoreComponent],
      providers: [{ provide: EntryService, useValue: entrySpy }]
    });

    entryTable = TestBed.createComponent(EntryNewStudyTable);
    tick();
    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();
  }));

  it('should have empty sets by default', () => {
    expect(entryTable.componentInstance.markedTraining.size).toEqual(0);
    expect(entryTable.componentInstance.markedDisabled.size).toEqual(0);
  });

  it('should be able to mark a entry as disabled', () => {
    const compiled = entryTable.nativeElement;
    spyOn(entryTable.componentInstance.markedDisabledChange, 'emit');

    const disabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[1];

    // NOTE: This is a hack to get the toggle to change. The toggle is not
    //       changing immediatly when clicked in the unit testing. This issue
    //       is not present in actual usage.
    disabledToggle.click();
    disabledToggle.click();

    expect(entryTable.componentInstance.markedDisabled.size).toEqual(1);
    expect(entryTable.componentInstance.markedDisabled.has('1')).toBeTrue();
    expect(entryTable.componentInstance.markedDisabledChange.emit).toHaveBeenCalled();
  });

  it('should be able to mark a entry as being part of the training set', () => {
    const compiled = entryTable.nativeElement;
    spyOn(entryTable.componentInstance.markedTrainingChange, 'emit');

    const trainingToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];

    trainingToggle.click();

    expect(entryTable.componentInstance.markedTraining.size).toEqual(1);
    expect(entryTable.componentInstance.markedTraining.has('1')).toBeTrue();
    expect(entryTable.componentInstance.markedTrainingChange.emit).toHaveBeenCalled();
  });

  it('should be able to swap back and forth marking a entry as disabled', () => {
    const compiled = entryTable.nativeElement;

    const disabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[1];

    // First click, should be marked as disabled
    disabledToggle.click();
    disabledToggle.click();
    expect(entryTable.componentInstance.markedDisabled.has('1')).toBeTrue();

    // Second click, should not be marked as disabled
    disabledToggle.click();
    expect(entryTable.componentInstance.markedDisabled.has('1')).toBeFalse();
  });

  it('should handle multiple disable selections', () => {
    const compiled = entryTable.nativeElement;

    // Select two entries to mark as disabled
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    toggles[1].click();
    toggles[1].click();
    toggles[3].click();
    toggles[3].click();

    expect(entryTable.componentInstance.markedDisabled.size).toEqual(2);
    expect(entryTable.componentInstance.markedDisabled.has('1')).toBeTrue();
    expect(entryTable.componentInstance.markedDisabled.has('2')).toBeTrue();
  });

  it('should handle multiple training selections', () => {
    const compiled = entryTable.nativeElement;

    // Select two entries to mark as disabled
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    toggles[0].click();
    toggles[2].click();

    expect(entryTable.componentInstance.markedTraining.size).toEqual(2);
    expect(entryTable.componentInstance.markedTraining.has('1')).toBeTrue();
    expect(entryTable.componentInstance.markedTraining.has('2')).toBeTrue();
  });
});
