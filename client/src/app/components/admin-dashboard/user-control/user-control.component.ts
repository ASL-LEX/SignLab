import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../../models/user';

/**
 * The User Control view allows admins the ability to edit user permissions
 * and provide a general view for all users. This also gives Admins the ability
 * to review the results of the user's training
 */
@Component({
  selector: 'user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit {
  // TODO: Get roles dynamically from server
  /** Columns to display in the user view */
  displayedColumns = ['username', 'name', 'email', 'isAdmin', 'isTagging',
                      'isRecording', 'taggingTrainingComplete',
                      'recordingTrainingComplete'];
  /** Stores the current list of all users, is exposed in the user control view */
  userData: User[] = [];

  /**
   * Make a new user control view.
   *
   * @param userService The service which is used to get all of the users
   */
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Get all of the users from the database and store the result in
    // `userData`
    this.userService.getUsers()
      .then(response => { this.userData = response });
  }

  /**
   * Function which acts as the call back for when a permission is changed for
   * a user. This call back is triggered when one of the check boxes for the
   * roles on the UI changes.
   *
   * If role cannot be changed, for example if the user does not have the right
   * permission level, then the check box is reverted and an error message is
   * shown.
   *
   * TODO: Have some way of ensuring there is at least one admin and/or
   *       not allowing the current user to remove their own admin privledges
   *
   * @param user The user to change the permission of
   * @param role The role to update
   * @param hasRole If the user should have the role or not
   */
  async updateRole(user: User, role: string, hasRole: boolean): Promise<void> {
    const result = await this.userService.changeRole(user, role, hasRole);

    // If the role update failed, revert the checkbox
    if(!result) {
      user.roles[role] = !hasRole;
      alert('Failed to update user role');
    }
  }
}
