import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'shared/dtos/user.dto';
import { UserService } from '../../core/services/user.service';
import { UserSelectDialog } from '../../user-table/components/user-select-dialog.component';

@Component( {
  selector: 'owner-landing',
  template: `
    <mat-card>
      <mat-card-title>Ownership Control</mat-card-title>
      <mat-card-content>
        <div>
          <button mat-stroked-button (click)="addOwner()" data-cy="addOwnerButton">Add Owner</button>

          <button mat-stroked-button (click)="transferOwnership()" data-cy="transferOwnerButton">Transfer Ownership</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./owner-landing.component.css']
})
export class OwnerLandingComponent {
  constructor(private dialog: MatDialog, private userService: UserService) {}

  async addOwner() {
    const ownerInfo = await this.userService.getOwnerInfo();
    const params = {
      width: '1000px',
      data: {
        title: `Select User To Add as owner (${ownerInfo.numberOfOwners} / ${ownerInfo.maxOwnerAccounts} spots available)`
      }
    };
    this.dialog
      .open(UserSelectDialog, params)
      .afterClosed()
      .subscribe(user => {
        if (user === undefined) { return; }
        this.handleAddingOwner(user.data);
      });
  }

  transferOwnership() {
    const params = {
      width: '1000px',
      data: {
        title: 'Select User to Transfer Ownership to'
      }
    };
    this.dialog
      .open(UserSelectDialog, params)
      .afterClosed()
      .subscribe(user => {
        if (user === undefined) { return; }
        this.handleTransferringOwnership(user.data);
      });
  }

  /**
   * Handle the user selection logic. This will prompt the user with
   * a "are you sure" before submitting the user against the backend to
   * add them as an owner
   */
  private handleAddingOwner(user: User): void {
    // Verify with the user
    if (!confirm(`Are you sure you want to add ${user.name} as an owner?`)) {
      return;
    }

    // Complete the transfer
    this.userService.addOwner(user);
  }

  /**
   * Handle transfering the ownership from the current user to the selected
   * user. Will make request against the backend
   */
  private async handleTransferringOwnership(user: User): Promise<void> {
    // Verify the transfer request
    if (!confirm(`Are you sure you want to transfer your ownership to ${user.name}? After this action you will no longer be an owner`)) {
      return;
    }

    // Complete the transfer
    await this.userService.transferOwnership(user);

    // TODO: Update the local representation of the user to reflect the
    // change
  }
}
