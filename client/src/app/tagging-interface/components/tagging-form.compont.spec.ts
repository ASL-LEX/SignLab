import { Tag } from 'shared/dtos/tag.dto';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TaggingForm } from './tagging-form.compont';
import { SharedModule } from '../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaggingForm', () => {
  const creator = {
    _id: '1',
    name: 'test',
    username: 'test',
    email: '',
    roles: {
      owner: false,
      studyContributor: {},
      projectAdmin: {},
      studyAdmin: {}
    }
  };

  const dataset = {
    _id: '1',
    name: 'test',
    description: 'test',
    creator: creator
  };

  const testTag1: Tag = {
    _id: 'something unique',
    entry: {
      entryID: 'I am a entry, trust me',
      mediaURL: '/media/video.mp4',
      mediaType: 'video',
      recordedInSignLab: false,
      responderID: '1',
      meta: {},
      creator: creator,
      dateCreated: new Date(),
      dataset: dataset
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
              type: 'string'
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
      },
      project: '1'
    },
    user: {
      _id: 'some user',
      name: 'Bobby',
      email: 'bob@bu.edu',
      username: 'bobby',
      roles: {
        owner: false,
        studyContributor: {},
        projectAdmin: {},
        studyAdmin: {}
      }
    },
    complete: false,
    isTraining: false,
    info: {}
  };

  let taggingForm: ComponentFixture<TaggingForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaggingForm],
      imports: [SharedModule, BrowserAnimationsModule]
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
    expect(video.getAttribute('src')).toEqual(testTag1.entry.mediaURL);
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
    expect(video.getAttribute('src')).toEqual(testTag1.entry.mediaURL);
  }));
});
