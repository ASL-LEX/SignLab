import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Tag } from '../../../../../shared/dtos/tag.dto';
import { ResponseService } from '../../services/response.service';
import { TaggingInterface } from './tagging-interface.component';

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
      enabled: true,
      meta: { },
      hasTag: {
        'study1': true
      }
    },
    study: {
      _id: 'study1',
      name: 'Study 1',
      description: 'Some study',
      instructions: 'Do your job',
      tagSchema: {
        dataSchema: {
          type: "object",
          properties: {
            name: {
              type: "string"
            }
          },
          required: ['name']
        },
        uiSchema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name'
            }
          ]
        }
      }
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
        owner: false
      }
    },
    complete: false,
    info: {

    }
  };

  const testTag2: Tag = {
    _id: 'a differe ID',
    response: {
      responseID: 'I am a response, trust me',
      videoURL: '/media/another-video.mp4',
      recordedInSignLab: false,
      responderID: '1',
      enabled: true,
      meta: { },
      hasTag: {
        'study1': true
      }
    },
    study: {
      _id: 'study1',
      name: 'Study 1',
      description: 'Some study',
      instructions: 'Do your job',
      tagSchema: {
        dataSchema: {
          type: "object",
          properties: {
            name: {
              type: "string"
            }
          },
          required: ['name']
        },
        uiSchema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name'
            }
          ]
        }
      }
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
        owner: false
      }
    },
    complete: false,
    info: {

    }
  };

  beforeEach(() => {
    responseSpy = jasmine.createSpyObj('ResponseService',
                                       ['getNextUntaggedResponse', 'addTag']);

    TestBed.configureTestingModule({
      declarations: [ TaggingInterface ],
      providers: [
        { provide: ResponseService, useValue: responseSpy }
      ]
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

  it('should handle displaying a tag', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(testTag1));

    // Have ngOnInit run and let changes take palace
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    // Ensure the video and form has been displayed
    const compiled = tagInterface.debugElement.nativeElement;
    const video = compiled.querySelector('video');
    const form = compiled.querySelector('jsonforms');

    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toEqual(testTag1.response.videoURL);
    expect(form).toBeTruthy();
  }));

  it('should handle failed submission', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(testTag1));
    responseSpy.addTag.and.throwError('Bad');

    // Have ngOnInit run and let changes take place
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    tagInterface.componentInstance.formSubmit();

    // Make sure the video hasn't changed
    const compiled = tagInterface.debugElement.nativeElement;
    const video = compiled.querySelector('video');

    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toEqual(testTag1.response.videoURL);
  }));

  it('should handle submitting one tag and getting another tag', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(testTag1));
    responseSpy.addTag.and.resolveTo();

    // Have ngOnInit run and let changes take place
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    // Attempt to submit and render the next tag
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(testTag2));
    tagInterface.componentInstance.formSubmit();
    tick();
    tagInterface.detectChanges();

    // Make sure the video has changed
    const compiled = tagInterface.debugElement.nativeElement;
    const video = compiled.querySelector('video');

    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toEqual(testTag2.response.videoURL);
  }));

  it('should handle submitting one tag and getting no more tags', fakeAsync(() => {
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(testTag1));
    responseSpy.addTag.and.resolveTo();

    // Have ngOnInit run and let changes take place
    tagInterface.detectChanges();
    tick();
    tagInterface.detectChanges();

    // Attempt to submit and render the "no more tags" message
    responseSpy.getNextUntaggedResponse.and.returnValue(Promise.resolve(null));
    tagInterface.componentInstance.formSubmit();
    tick();
    tagInterface.detectChanges();

    // Make sure the video has changed
    const compiled = tagInterface.debugElement.nativeElement;
    const card = compiled.querySelector('mat-card-content');

    expect(card).toBeTruthy();
    expect(card.textContent).toContain('All responses have been tagged so far');
  }));
});
