import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { Tag } from 'shared/dtos/tag.dto';
import { ResponseService } from '../../core/services/response.service';
import { TaggingInterface } from './tagging-interface.component';
import { StudyService } from '../../core/services/study.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/services/auth.service';

describe('TaggingInterface', () => {
  // Unit under test
  let tagInterface: ComponentFixture<TaggingInterface>;
  let responseSpy: jasmine.SpyObj<ResponseService>;

  const testTag1: Tag = {
    _id: 'something unique',
    response: {
      responseID: 'I am a response, trust me',
      videoURL: '/media/video.mp4',
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
    },
    study: {
      _id: 'study1',
      name: 'Study 1',
      description: 'Some study',
      instructions: 'Do your job',
      tagSchema: {
        dataSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
        uiSchema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name',
            },
          ],
        },
      },
    },
    user: {
      _id: 'some user',
      name: 'Bobby',
      email: 'bob@bu.edu',
      username: 'bobby',
      roles: {
        admin: false,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false,
      },
    },
    complete: false,
    isTraining: false,
    info: {},
  };

  const testTag2: Tag = {
    _id: 'a differe ID',
    response: {
      responseID: 'I am a response, trust me',
      videoURL: '/media/another-video.mp4',
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
    },
    study: {
      _id: 'study1',
      name: 'Study 1',
      description: 'Some study',
      instructions: 'Do your job',
      tagSchema: {
        dataSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
          required: ['name'],
        },
        uiSchema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name',
            },
          ],
        },
      },
    },
    user: {
      _id: 'some user',
      name: 'Bobby',
      email: 'bob@bu.edu',
      username: 'bobby',
      roles: {
        admin: false,
        tagging: true,
        recording: false,
        accessing: false,
        owner: false,
      },
    },
    complete: false,
    isTraining: false,
    info: {},
  };

  const authSpy = {
    get user() {
      return testTag1.user;
    },
  };

  beforeEach(() => {
    responseSpy = jasmine.createSpyObj('ResponseService', [
      'getNextUntaggedResponse',
      'addTag',
    ]);
    const studySpy = jasmine.createSpyObj('StudyService', ['getStudies']);
    studySpy.getStudies.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      declarations: [TaggingInterface],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        { provide: ResponseService, useValue: responseSpy },
        { provide: StudyService, useValue: studySpy },
        { provide: AuthService, useValue: authSpy },
      ],
    });

    tagInterface = TestBed.createComponent(TaggingInterface);
  });

  it('should handle no remaing tags', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(null));

    // Have ngOnInit run and let changes take place
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    // Check to ensure the expected message is shown
    const compiled = tagInterface.debugElement.nativeElement;
    const card = compiled.querySelector('mat-card-content');

    expect(card).toBeTruthy();
    expect(card.textContent).toContain('All responses have been tagged so far');
  }));

  it('should handle submitting one tag and getting no more tags', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(
      Promise.resolve(testTag1)
    );
    responseSpy.addTag.and.resolveTo();

    // Have ngOnInit run and let changes take place
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    // Attempt to submit and render the "no more tags" message
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(null));
    tagInterface.componentInstance.formSubmit(testTag2);
    tick();
    tagInterface.detectChanges();

    // Make sure the video has changed
    const compiled = tagInterface.debugElement.nativeElement;
    const card = compiled.querySelector('mat-card-content');

    expect(card).toBeTruthy();
    expect(card.textContent).toContain('All responses have been tagged so far');
  }));
});
