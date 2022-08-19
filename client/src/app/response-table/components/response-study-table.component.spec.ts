import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResponseService } from '../../core/services/response.service';
import { ResponseStudyTable } from './response-study-table.component';
import { ResponseStudy } from '../../../../../shared/dtos/responsestudy.dto';
import { SharedModule } from '../../shared/shared.module';
import { ResponseTableCoreComponent } from './response-table-core.component';


describe('ResponseStudyTable', () => {
  const exampleResponseData: ResponseStudy[] = [
    {
      _id: '1',
      response: {
        _id: '1',
        responseID: '1',
        videoURL: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {}
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        }
      },
      isPartOfStudy: false,
      isUsedForTraining: false,
      hasTag: false
    },
    {
      _id: '2',
      response: {
        _id: '2',
        responseID: '2',
        videoURL: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {}
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        }
      },
      isPartOfStudy: false,
      isUsedForTraining: false,
      hasTag: false
    },
    {
      _id: '3',
      response: {
        _id: '3',
        responseID: '3',
        videoURL: 'video',
        duration: 5,
        recordedInSignLab: false,
        responderID: '1',
        meta: {}
      },
      study: {
        _id: '1',
        name: 'Default',
        description: 'A study',
        instructions: 'Fill it out',
        tagSchema: {
          dataSchema: {},
          uiSchema: {}
        }
      },
      isPartOfStudy: true,
      isUsedForTraining: false,
      hasTag: false
    },

  ];

  // Response service spy to serve fake data
  let responseSpy: jasmine.SpyObj<ResponseService>;
  // Test component
  let responseTable: ComponentFixture<ResponseStudyTable>;

  beforeEach(fakeAsync(() => {
    responseSpy = jasmine.createSpyObj('ResponseService', ['getResponseStudies', 'setUsedInStudy']);
    responseSpy.getResponseStudies.and.returnValue(Promise.resolve(JSON.parse(JSON.stringify(exampleResponseData))));
    responseSpy.setUsedInStudy.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [
        ResponseStudyTable,
        ResponseTableCoreComponent
      ],
      providers: [
        { provide: ResponseService, useValue: responseSpy }
      ]
    });


    responseTable = TestBed.createComponent(ResponseStudyTable);
    responseTable.componentInstance.study = exampleResponseData[0].study;
    tick();
    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();
  }));

  it('should load in correctly which responses are disabled', () => {
    const compiled = responseTable.nativeElement;

    // Get the toggle controls
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    expect(toggles.length).toEqual(3);

    // Get the state of the toggles
    const toggleStates: boolean[] = [];
    for(const toggle of toggles) {
      toggleStates.push(toggle.getAttribute('aria-checked') == 'true');
    }

    // Based on the example data, only the last response should be enabled
    expect(toggleStates).toEqual([false, false, true]);
  });

  it('should allow disabling of responses in a study', fakeAsync(() => {
    const compiled = responseTable.nativeElement;

    // Get the toggle associated with an enabled response
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[2];
    enabledToggle.click();

    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();

    expect(responseSpy.setUsedInStudy).toHaveBeenCalledWith('3', false, '1');
  }));

  it('should allow enabling fo responses in a study', fakeAsync(() => {
    const compiled = responseTable.nativeElement;

    // Get the toggle associated with an enabled response
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];
    enabledToggle.click();

    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();

    expect(responseSpy.setUsedInStudy).toHaveBeenCalledWith('1', true, '1');
  }));

  it('should do nothing if the response id is not present', fakeAsync(() => {
    const compiled = responseTable.nativeElement;

    // Make the response ID undefined
    responseTable.componentInstance.responseData[0].response._id = undefined;

    // Get the toggle associated with an enabled response
    const enabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];
    enabledToggle.click();

    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();

    expect(responseSpy.setUsedInStudy).toHaveBeenCalledTimes(0);
  }));
});
