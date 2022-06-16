import {  NgModule  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {  from  } from 'rxjs';

const MaterialComponents = [
  MatButtonModule
];

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
 })
export class MaterialModule { }
