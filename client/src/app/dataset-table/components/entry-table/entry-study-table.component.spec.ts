import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EntryService } from '../../../core/services/entry.service';
import { EntryStudyTable } from './entry-study-table.component';
import { EntryStudy } from 'shared/dtos/entrystudy.dto';
import { SharedModule } from '../../../shared/shared.module';
import { EntryTableCoreComponent } from './entry-table-core.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EntryStudyTable', () => {
  const creator = {
    _id: '1',
    id: '1',
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

  const dataset = {
    id: '1',
    _id: '1',
    name: 'test',
    description: 'test',
    creator: creator,
    projectAccess: {}
  };
  const exampleEntryData: EntryStudy[] = [
    {
      _id: '1',
      entry: {
        _id: '1',
        entryID: '1',
        mediaURL: 'video',
        mediaType: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {},
        dateCreated: new Date(),
        creator: creator,
        dataset: dataset
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        },
        project: '1'
      },
      isPartOfStudy: false,
      isUsedForTraining: false,
      hasTag: false
    },
    {
      _id: '2',
      entry: {
        _id: '2',
        entryID: '2',
        mediaURL: 'video',
        mediaType: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {},
        dateCreated: new Date(),
        creator: creator,
        dataset: dataset
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        },
        project: '1'
      },
      isPartOfStudy: false,
      isUsedForTraining: false,
      hasTag: false
    },
    {
      _id: '3',
      entry: {
        _id: '3',
        entryID: '3',
        mediaURL: 'video',
        mediaType: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {},
        dateCreated: new Date(),
        creator: creator,
        dataset: dataset
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        },
        project: '1'
      },
      isPartOfStudy: true,
      isUsedForTraining: false,
      hasTag: false
    }
  ];

  // Entry service spy to serve fake data
  let entrySpy: jasmine.SpyObj<EntryService>;
  // Test component
  let entryTable: ComponentFixture<EntryStudyTable>;

  beforeEach(fakeAsync(() => {
    entrySpy = jasmine.createSpyObj('EntryService', ['getEntryStudies', 'setUsedInStudy']);
    entrySpy.getEntryStudies.and.returnValue(Promise.resolve(JSON.parse(JSON.stringify(exampleEntryData))));
    entrySpy.setUsedInStudy.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule],
      declarations: [EntryStudyTable, EntryTableCoreComponent],
      providers: [{ provide: EntryService, useValue: entrySpy }]
    });

    entryTable = TestBed.createComponent(EntryStudyTable);
    entryTable.componentInstance.study = exampleEntryData[0].study;
    entryTable.componentInstance.dataset = dataset;
    tick();
    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();
  }));

  it('should load in correctly which entries are disabled', () => {
    const compiled = entryTable.nativeElement;

    // Get the toggle controls
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    expect(toggles.length).toEqual(3);

    // Get the state of the toggles
    const toggleStates: boolean[] = [];
    for (const toggle of toggles) {
      toggleStates.push(toggle.getAttribute('aria-checked') == 'true');
    }

    // Based on the example data, only the last entry should be enabled
    expect(toggleStates).toEqual([false, false, true]);
  });

  it('should allow disabling of entries in a study', fakeAsync(() => {
    const compiled = entryTable.nativeElement;

    // Get the toggle associated with an enabled entry
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[2];
    enabledToggle.click();

    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();

    expect(entrySpy.setUsedInStudy).toHaveBeenCalledWith('3', false, '1');
  }));

  it('should allow enabling fo entries in a study', fakeAsync(() => {
    const compiled = entryTable.nativeElement;

    // Get the toggle associated with an enabled entry
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];
    enabledToggle.click();

    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();

    expect(entrySpy.setUsedInStudy).toHaveBeenCalledWith('1', true, '1');
  }));

  it('should do nothing if the entry id is not present', fakeAsync(() => {
    const compiled = entryTable.nativeElement;

    // Make the entry ID undefined
    entryTable.componentInstance.entryData[0].entry._id = undefined;

    // Get the toggle associated with an enabled entry
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];
    enabledToggle.click();

    entryTable.detectChanges();
    tick();
    entryTable.detectChanges();

    expect(entrySpy.setUsedInStudy).toHaveBeenCalledTimes(0);
  }));
});
