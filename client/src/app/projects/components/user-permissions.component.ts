import { Component } from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { User } from 'shared/dtos/user.dto';
import { ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'project-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css'],
})
export class UserPermissionsComponent {
  /**
   * The ID of the current project, this is used to determine the target
   * project to change the permissions of.
   */
  activeProjectID: string | null;
  /** The list of all users */
  users: User[] = [];

  displayedColumns = [
    'name', 'username', 'email', 'projectAdmin'
  ];

  constructor(public readonly projectService: ProjectService, public readonly userService: UserService) {
    /** Update activeProjectID when the active project changes. */
    projectService.activeProject.subscribe(project => {
      this.activeProjectID = project ? project._id! : null;
    });

    userService.getUsers().then(users => {
      this.users = users;
    });
  }

  toggleProjectAdmin(toggleChange: { user: User, checked: MatCheckboxChange }) {
    try {
      this.projectService.changeAdminStatus(toggleChange.user, toggleChange.checked.checked);
    } catch(error: any) {
      // Log the error and revert the toggle
      console.error('Failed to change admin status', error);
      toggleChange.user.roles.projectAdmin[this.activeProjectID!] = !toggleChange.checked;
    }

    // Make sure the checkbox matches the state
    toggleChange.checked.source.checked = toggleChange.user.roles.projectAdmin && toggleChange.user.roles.projectAdmin[this.activeProjectID!];
  }
}
