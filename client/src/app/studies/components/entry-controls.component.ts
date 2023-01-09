import { Component } from '@angular/core';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'entry-controls',
  template: `
    <dataset-study-table
      *ngIf="studyService.activeStudy | async as activeStudy; else loading"
      [study]="activeStudy"
    ></dataset-study-table>
    <ng-template #loading>Loading...</ng-template>
  `,
})
export class EntryControlsComponent {
  constructor(public studyService: StudyService) {}
}
