import { Tag } from 'shared/dtos/tag.dto';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TaggingForm } from './tagging-form.compont';
import { SharedModule } from '../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaggingForm', () => {
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
      password: 'hi',
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

  let taggingForm: ComponentFixture<TaggingForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaggingForm],
      imports: [SharedModule, BrowserAnimationsModule],
    });

    taggingForm = TestBed.createComponent(TaggingForm);
  });

  it('should handle displaying a tag', fakeAsync(() => {
    taggingForm.componentInstance.tag = testTag1;

    // Have ngOnInit run and let changes take palace
    taggingForm.detectChanges();
    tick();
    taggingForm.detectChanges();

    // Ensure the video and form has been displayed
    const compiled = taggingForm.debugElement.nativeElement;
    const video = compiled.querySelector('video');
    const form = compiled.querySelector('jsonforms');

    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toEqual(testTag1.response.videoURL);
    expect(form).toBeTruthy();
  }));

  it('should handle failed submission', fakeAsync(() => {
    taggingForm.componentInstance.tag = testTag1;

    // Have ngOnInit run and let changes take place
    taggingForm.detectChanges();
    tick();
    taggingForm.detectChanges();

    taggingForm.componentInstance.formSubmit();

    // Make sure the video hasn't changed
    const compiled = taggingForm.debugElement.nativeElement;
    const video = compiled.querySelector('video');

    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toEqual(testTag1.response.videoURL);
  }));
});
