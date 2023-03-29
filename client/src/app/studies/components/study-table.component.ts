import { Component } from '@angular/core';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'study-table',
  templateUrl: './study-table.component.html',
  styleUrls: ['./study-table.component.css']
})
export class StudyTable {
  displayedColumns = ['name', 'description', 'delete'];

  constructor(private readonly studyService: StudyService) {}

  handleDeletion(study: Study) {}
}
