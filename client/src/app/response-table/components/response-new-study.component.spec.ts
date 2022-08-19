import { ResponseService } from '../../core/services/response.service';
import { Response } from '../../../../../shared/dtos/response.dto';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResponseNewStudyTable } from './response-new-study.component';
import { SharedModule } from '../../shared/shared.module';
import { ResponseTableCoreComponent } from './response-table-core.component';

describe('ResponseNewStudyTable', () => {
  const exampleResponseData: Response[] = [
    {
      _id: '1',
      responseID: '1',
      videoURL: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {}
    },
    {
      _id: '2',
      responseID: '1',
      videoURL: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {}
    },
    {
      _id: '3',
      responseID: '1',
      videoURL: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {}
    },
    {
      _id: '4',
      responseID: '1',
      videoURL: 'video',
      duration: 5,
      recordedInSignLab: false,
      responderID: '1',
      meta: {}
    }
  ];

  // Response service spy to serve fake data
  let responseSpy: jasmine.SpyObj<ResponseService>;
  // Test component
  let responseTable: ComponentFixture<ResponseNewStudyTable>;

  beforeEach(fakeAsync(() => {
    responseSpy = jasmine.createSpyObj('ResponseService', ['getResponses']);
    responseSpy.getResponses.and.returnValue(Promise.resolve(exampleResponseData));

    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [
        ResponseNewStudyTable,
        ResponseTableCoreComponent
      ],
      providers: [
        { provide: ResponseService, useValue: responseSpy }
      ]
    });

    responseTable = TestBed.createComponent(ResponseNewStudyTable);
    tick();
    responseTable.detectChanges();
    tick();
    responseTable.detectChanges();
  }));

  it('should have empty sets by default', () => {
    expect(responseTable.componentInstance.markedTraining.size).toEqual(0);
    expect(responseTable.componentInstance.markedDisabled.size).toEqual(0);
  });

  it('should be able to mark a response as disabled', () => {
    const compiled = responseTable.nativeElement;
    spyOn(responseTable.componentInstance.markedDisabledChange, 'emit');

    const disabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[1];

    disabledToggle.click();

    expect(responseTable.componentInstance.markedDisabled.size).toEqual(1);
    expect(responseTable.componentInstance.markedDisabled.has('1')).toBeTrue();
    expect(responseTable.componentInstance.markedDisabledChange.emit).toHaveBeenCalled();
  });

  it('should be able to mark a response as being part of the training set', () => {
    const compiled = responseTable.nativeElement;
    spyOn(responseTable.componentInstance.markedTrainingChange, 'emit');

    const trainingToggle = compiled.querySelectorAll('td mat-slide-toggle input')[0];

    trainingToggle.click();

    expect(responseTable.componentInstance.markedTraining.size).toEqual(1);
    expect(responseTable.componentInstance.markedTraining.has('1')).toBeTrue();
    expect(responseTable.componentInstance.markedTrainingChange.emit).toHaveBeenCalled();
  });

  it('should be able to swap back and forth marking a response as disabled', () => {
    const compiled = responseTable.nativeElement;

    const disabledToggle = compiled.querySelectorAll('td mat-slide-toggle input')[1];

    // First click, should be marked as disabled
    disabledToggle.click();
    expect(responseTable.componentInstance.markedDisabled.has('1')).toBeTrue();

    // Second click, should not be marked as disabled
    disabledToggle.click();
    expect(responseTable.componentInstance.markedDisabled.has('1')).toBeFalse();
  });

  it('should handle multiple disable selections', () => {
    const compiled = responseTable.nativeElement;

    // Select two responses to mark as disabled
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    toggles[1].click();
    toggles[3].click();

    expect(responseTable.componentInstance.markedDisabled.size).toEqual(2);
    expect(responseTable.componentInstance.markedDisabled.has('1')).toBeTrue();
    expect(responseTable.componentInstance.markedDisabled.has('2')).toBeTrue();
  });

  it('should handle multiple training selections', () => {
    const compiled = responseTable.nativeElement;

    // Select two responses to mark as disabled
    const toggles = compiled.querySelectorAll('td mat-slide-toggle input');
    toggles[0].click();
    toggles[2].click();

    expect(responseTable.componentInstance.markedTraining.size).toEqual(2);
    expect(responseTable.componentInstance.markedTraining.has('1')).toBeTrue();
    expect(responseTable.componentInstance.markedTraining.has('2')).toBeTrue();
  });
});
