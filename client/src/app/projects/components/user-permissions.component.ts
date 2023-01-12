import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
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

  async toggleProjectAdmin(toggleChange: { user: User, change: MatSlideToggleChange}) {
    try {
      await this.projectService.changeAdminStatus(toggleChange.user, toggleChange.change.checked);
      toggleChange.user.roles.projectAdmin[this.activeProjectID!] = toggleChange.change.checked;
    } catch(error: any) {
      // Log the error and revert the toggle
      console.error('Failed to change admin status', error);
      toggleChange.user.roles.projectAdmin[this.activeProjectID!] = !toggleChange.change;
    }

    // Make sure the checkbox matches the state
    toggleChange.change.source.checked = toggleChange.user.roles.projectAdmin[this.activeProjectID!];
  }
}
