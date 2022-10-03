import { Component } from '@angular/core';

@Component( {
  selector: 'owner-landing',
  template: `
    <mat-card>
      <mat-card-title>Ownership Control</mat-card-title>
      <mat-card-content>
        <div>
          <button mat-stroked-button>Add Owner</button>

          <button mat-stroked-button>Transfer Ownership</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./owner-landing.component.css']
})
export class OwnerLandingComponent { }
