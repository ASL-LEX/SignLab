import { Component } from '@angular/core';
import { StudyService } from '../../core/services/study.service';

@Component({
  template: `<user-study-table [study]="studyService.getActiveStudy()!"></user-study-table>`
})
export class UserPermissionsComponent {
  constructor(public studyService: StudyService) {}
}
