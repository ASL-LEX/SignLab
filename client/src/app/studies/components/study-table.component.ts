import { Component } from '@angular/core';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'study-table',
  templateUrl: './study-table.component.html',
  styleUrls: ['./study-table.component.css']
})
export class StudyTable {
  displayedColumns = [
    'name'
  ];

  constructor(private readonly studyService: StudyService) {}
}
