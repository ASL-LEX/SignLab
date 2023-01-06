import { Component } from '@angular/core';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'entry-controls',
  template: `
    <dataset-study-table [study]="studyService.getActiveStudy()"></dataset-study-table>
  `,
})
export class EntryControlsComponent {
  constructor(public studyService: StudyService) {}
}
