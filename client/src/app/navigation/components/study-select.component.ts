import { Component } from '@angular/core';

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
          <mat-select class="select-field">
            <mat-select-trigger><mat-icon>not_interested</mat-icon>No Study Selected</mat-select-trigger>
            <mat-option value="" selected><mat-icon>not_interested</mat-icon>No Study Selected</mat-option>
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
