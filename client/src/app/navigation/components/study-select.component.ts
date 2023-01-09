import { Component } from '@angular/core';

@Component({
  selector: 'study-select',
  template: `
    <mat-card class="study-select-card">
      <mat-card-content>
        <div fxLayout="row" fxLayoutAlign="center" class="study-select">
          <p>Study: </p>
          <mat-select class="select-field">
            <mat-option value="1">Study 1</mat-option>
            <mat-option value="2">Study 2</mat-option>
            <mat-option value="3">Study 3</mat-option>
          </mat-select>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./study-select.component.css']
})
export class StudySelect {}
