import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { UserTableElement } from '../models/user-table-element';

@Component({
  selector: 'user-select-dialog',
  template: `
    <mat-card>
      <mat-card-title>{{ title }}</mat-card-title>

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
  /** What to display to the user what the selection is for */
  title = '';

  constructor(private userService: UserService,
              private dialogRef: MatDialogRef<UserSelectDialog>,
              @Inject(MAT_DIALOG_DATA) data: { title: string }) {
    this.title = data.title;
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
