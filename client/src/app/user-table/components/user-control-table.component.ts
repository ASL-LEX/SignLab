import { Component, OnInit } from '@angular/core';
import {UserService} from 'src/app/core/services/user.service';
import { UserTableElement, UserToggleChange } from '../models/user-table-element';

@Component({
  selector: 'user-control-table',
  template: `
    <user-table-core
      [userData]="userData"
      [displayedColumns]="['username', 'name', 'email', 'isAdmin']"
      (adminChange)="updateAdminRole($event)"
    ></user-table-core>
  `
})
export class UserControlTable implements OnInit {
  userData: UserTableElement[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    this.userData = (await this.userService.getUsers()).map(user => {
      return { user: user };
    });
  }

  async updateAdminRole(toggle: UserToggleChange) {
    const result = await this.userService.changeRole(toggle.user, 'admin', toggle.option);

    // If the role update failed, revert the checkbox
    if (!result) {
      toggle.user.roles.admin = toggle.option;
      alert('Failed to update user role');
    }
  }
}
