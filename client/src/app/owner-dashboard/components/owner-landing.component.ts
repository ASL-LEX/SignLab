import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'shared/dtos/user.dto';
import { UserSelectDialog } from '../../user-table/components/user-select-dialog.component';

@Component( {
  selector: 'owner-landing',
  template: `
    <mat-card>
      <mat-card-title>Ownership Control</mat-card-title>
      <mat-card-content>
        <div>
          <button mat-stroked-button (click)="addOwner()">Add Owner</button>

          <button mat-stroked-button>Transfer Ownership</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./owner-landing.component.css']
})
export class OwnerLandingComponent {
  constructor(private dialog: MatDialog) {}


  addOwner() {
    const params = {
      width: '1000px'
    };
    this.dialog
      .open(UserSelectDialog, params)
      .afterClosed()
      .subscribe(user => {
        this.selectUser(user.data);
      });
  }

  /**
   * Handle the user selection logic. This will prompt the user with
   * a "are you sure" before submitting the user against the backend to
   * add them as an owner
   */
  private selectUser(user: User | undefined) {
    // Do nothing if the user is undefined
    if (user === undefined) { return; }

    // Verify with the user
    if(!confirm(`Are you sure you want to add ${user.name} as an owner?`)) {
      return;
    }
  }
}
