import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StudyService } from '../.../../../../../core/services/study.service';
import { Study } from 'shared/dtos/study.dto';
import { UserStudy } from 'shared/dtos/userstudy.dto';
import { SharedModule } from '../../../../shared/shared.module';
import { UserStudyComponent } from './user-study-control.component';

describe('UserStudyComponent', () => {
  const testStudy: Study = {
    _id: '1',
    name: 'Test',
    description: 'Some test study',
    instructions: 'Just do it',
    tagSchema: {
      dataSchema: {},
      uiSchema: {},
    },
  };

  const testUserStudyData: UserStudy[] = [
    {
      _id: '1',
      user: {
        _id: '1',
        name: 'bob',
        email: 'bob@bu.edu',
        username: 'bob',
        password: 'fake',
        roles: {
          admin: false,
          tagging: false,
          recording: false,
          accessing: false,
          owner: false,
        },
      },
      study: testStudy,
      trainingResponseStudies: [],
      hasAccessToStudy: false,
    },
    {
      _id: '2',
      user: {
        _id: '2',
        name: 'sam',
        email: 'sam@bu.edu',
        username: 'sam',
        password: 'fake',
        roles: {
          admin: false,
          tagging: false,
          recording: false,
          accessing: false,
          owner: false,
        },
      },
      study: testStudy,
      trainingResponseStudies: [],
      hasAccessToStudy: false,
    },
    {
      _id: '3',
      user: {
        _id: '3',
        name: 'mary',
        email: 'mary@bu.edu',
        username: 'mary',
        password: 'fake',
        roles: {
          admin: false,
          tagging: false,
          recording: false,
          accessing: false,
          owner: false,
        },
      },
      study: testStudy,
      trainingResponseStudies: [],
      hasAccessToStudy: true,
    },
  ];

  let studySpy: jasmine.SpyObj<StudyService>;
  // Test component
  let userStudyComponent: ComponentFixture<UserStudyComponent>;

  beforeEach(fakeAsync(() => {
    studySpy = jasmine.createSpyObj('StudyService', [
      'changeAccessToStudy',
      'getUserStudies',
    ]);
    studySpy.changeAccessToStudy.and.returnValue(Promise.resolve(true));
    studySpy.getUserStudies.and.returnValue(
      Promise.resolve(JSON.parse(JSON.stringify(testUserStudyData)))
    );

    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserStudyComponent],
      providers: [{ provide: StudyService, useValue: studySpy }],
    });

    userStudyComponent = TestBed.createComponent(UserStudyComponent);
    userStudyComponent.componentInstance.study = testStudy;
    tick();
    userStudyComponent.detectChanges();
    tick();
    userStudyComponent.detectChanges();
    tick();
    userStudyComponent.detectChanges();
  }));

  it('should display data correctly', () => {
    const compiled = userStudyComponent.nativeElement;

    // Make sure there are 3 rows
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    expect(toggles.length).toEqual(3);

    // Check the state of the toggles
    const toggleStates: boolean[] = [];
    for (const toggle of toggles) {
      toggleStates.push(toggle.getAttribute('aria-checked') == 'true');
    }

    expect(toggleStates).toEqual([false, false, true]);
  });

  it('shoud allow giving access to a study', fakeAsync(() => {
    const compiled = userStudyComponent.nativeElement;

    // Get the toggle associated with an enabled response
    const enabledToggle = compiled.querySelectorAll(
      'td mat-slide-toggle input'
    )[0];
    enabledToggle.click();

    userStudyComponent.detectChanges();
    tick();
    userStudyComponent.detectChanges();

    const expectedCallParam = JSON.parse(JSON.stringify(testUserStudyData[0]));
    expectedCallParam.hasAccessToStudy = true;
    expect(studySpy.changeAccessToStudy).toHaveBeenCalledWith(
      expectedCallParam,
      true
    );
  }));

  it('should allow removing access to a study', fakeAsync(() => {
    const compiled = userStudyComponent.nativeElement;

    // Get the toggle associated with an enabled response
    const enabledToggle = compiled.querySelectorAll(
      'td mat-slide-toggle input'
    )[2];
    enabledToggle.click();

    userStudyComponent.detectChanges();
    tick();
    userStudyComponent.detectChanges();

    const expectedCallParam = JSON.parse(JSON.stringify(testUserStudyData[2]));
    expectedCallParam.hasAccessToStudy = false;
    expect(studySpy.changeAccessToStudy).toHaveBeenCalledWith(
      expectedCallParam,
      false
    );
  }));
});
