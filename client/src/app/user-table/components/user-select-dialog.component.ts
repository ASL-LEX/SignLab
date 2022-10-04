import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { UserTableElement } from '../models/user-table-element';

@Component({
  selector: 'user-select-dialog',
  template: `
    <mat-card>
      <mat-card-title>Select User to Add as Owner (2/3 spots available)</mat-card-title>

      <mat-card-content>
        <user-table-core
          [userData]="userData"
          [displayedColumns]="['select', 'username', 'name', 'email']"
          (userSelected)="selectUser($event)"
        ></user-table-core>
      </mat-card-content>
    </mat-card>
  `,
})
export class UserSelectDialog {
  /** The user data which is inserted into the table */
  userData: UserTableElement[] = [];

  constructor(private userService: UserService,
              private dialogRef: MatDialogRef<UserSelectDialog>) {
    this.loadUserData();
  }

  async loadUserData() {
    this.userData = (await this.userService.getUsers()).map(user => {
      return { user: user };
    });
  }

  /**
   * Select the user, provide the selected user and close the dialog
   */
  selectUser(user: UserTableElement) {
    this.dialogRef.close({ data: user.user });
  }
}
