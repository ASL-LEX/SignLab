import { Component } from '@angular/core';
import { StudyService } from '../../core/services/study.service';

@Component({
  template: `<user-study-table *ngIf="(studyService.activeStudy | async) as activeStudy; else loading"
                                [study]="activeStudy"></user-study-table>
             <ng-template #loading>Loading...</ng-template>`
})
export class UserPermissionsComponent {
  constructor(public studyService: StudyService) {}
}
