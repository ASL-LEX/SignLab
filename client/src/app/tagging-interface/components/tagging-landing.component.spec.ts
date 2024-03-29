import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { StudyService } from '../../core/services/study.service';
import { TaggingLanding } from './tagging-landing.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from 'shared/dtos/user.dto';
import { of } from 'rxjs';

describe('TaggingLanding', () => {
  const testUser: User = {
    _id: '3',
    name: 'mary',
    email: 'mary@bu.edu',
    username: 'mary',
    roles: {
      owner: false,
      studyContributor: new Map<string, boolean>([['1', true]]),
      projectAdmin: new Map<string, boolean>(),
      studyAdmin: new Map<string, boolean>(),
      studyVisible: new Map<string, boolean>()
    },
    organization: {
      _id: '1',
      name: 'ASL-LEX'
    }
  };

  const testStudy = {
    _id: '1',
    name: 'Some',
    description: 'A study',
    instructions: 'You gotta',
    tagSchema: {
      dataSchema: {},
      uiSchema: {}
    },
    project: '1',
    tagsPerEntry: 1,
    tags: []
  };

  const testUserStudy = {
    _id: '1',
    user: testUser,
    study: testStudy,
    trainingEntryStudies: [],
    hasAccessToStudy: false
  };

  const authSpy = {
    get user() {
      return testUser;
    }
  };
  let studySpy: jasmine.SpyObj<StudyService>;
  // Test component
  let taggingLanding: ComponentFixture<TaggingLanding>;

  beforeEach(fakeAsync(() => {
    studySpy = jasmine.createSpyObj('StudyService', ['getUserStudy', 'getStudies', 'activeStudy'], {
      activeStudy: of(testStudy)
    });
    studySpy.getUserStudy.and.returnValue(Promise.resolve(testUserStudy));
    studySpy.getStudies.and.returnValue(Promise.resolve([testStudy]));

    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TaggingLanding],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: StudyService, useValue: studySpy }
      ]
    });

    taggingLanding = TestBed.createComponent(TaggingLanding);
    taggingLanding.detectChanges();
    tick();
    taggingLanding.detectChanges();
    tick();
    taggingLanding.detectChanges();
  }));

  it('should handle when a user does not have access to a study', () => {
    const compiled = taggingLanding.nativeElement;

    // Should have a message explaining to the user they don't have access
    const message = compiled.querySelector('div p');
    expect(message.textContent).toContain(
      'Training Complete! Reach out to your study administrator to get access to tagging'
    );

    // The button to access the tagging interface should be disabled

    const button = compiled.querySelectorAll('mat-card-content div button')[0];
    expect(button.getAttribute('disabled')).toEqual('true');
  });

  it('should handle when a user has access to the study', () => {
    // Insert test data that has access to the study
    const withAccess = JSON.parse(JSON.stringify(testUserStudy));
    withAccess.user.roles.studyContributor['1'] = true;
    taggingLanding.componentInstance.userStudy = withAccess;

    taggingLanding.detectChanges();

    const compiled = taggingLanding.nativeElement;

    // Should be able to select the enter tagging button
    const button = compiled.querySelectorAll('mat-card-content div button')[0];
    expect(button.getAttribute('disabled')).toBeNull();
  });

  it('should handle when a user still has training to complete', () => {
    // Insert test data that has a entry left to tag
    const withTrainingLeft = JSON.parse(JSON.stringify(testUserStudy));
    withTrainingLeft.trainingEntryStudies.push({
      _id: '1',
      entry: {
        _id: '1',
        entryID: '1',
        videoURL: 'hello.mp4',
        duration: 3,
        recordedInSignLab: false,
        responderID: '1',
        meta: {}
      },
      study: testStudy,
      isPartOfStudy: false,
      isUsedForTraining: true,
      hasTag: false
    });
    taggingLanding.componentInstance.userStudy = withTrainingLeft;

    taggingLanding.detectChanges();

    const compiled = taggingLanding.nativeElement;

    // Should be able to select the enter training button
    const button = compiled.querySelectorAll('mat-card-content div button')[0];
    expect(button.getAttribute('disabled')).toBeNull();
  });
});
