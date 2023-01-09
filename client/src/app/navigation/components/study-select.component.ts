import { Component, OnInit } from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import {Study} from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';

@Component({
  selector: 'study-select',
  template: `
    <mat-card class="study-select-card">
      <mat-card-header>
        <mat-card-title>Environment</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div fxLayout="row" fxLayoutAlign="center" class="study-select">
          <p>Study: </p>
          <mat-select class="select-field" placeholder="No Study Selected" (selectionChange)="studySelect($event)" [value]="studyService.getActiveStudy()">
            <mat-option *ngFor="let study of studies" [value]="study">
              {{ study.name }}
            </mat-option>
          </mat-select>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./study-select.component.css']
})
export class StudySelect implements OnInit {
  studies: Study[] = [];

  constructor(public studyService: StudyService) {}

  ngOnInit(): void {
    this.studyService.getStudies().then(studies => {
      this.studies = studies;
    });
  }

  studySelect(event: MatSelectChange): void {
    this.studyService.setActiveStudy(event.value);
  }

}
