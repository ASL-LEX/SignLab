import { Component } from '@angular/core';
import { User } from 'shared/dtos/user.dto';
import { ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'project-user-permissions',
  templateUrl: './user-permissions.component.html',
})
export class UserPermissionsComponent {
  /**
   * The ID of the current project, this is used to determine the target
   * project to change the permissions of.
   */
  activeProjectID: string | null;
  /** The list of all users */
  users: User[] = [];

  constructor(public readonly projectService: ProjectService, public readonly userService: UserService) {
    /** Update activeProjectID when the active project changes. */
    projectService.activeProject.subscribe(project => {
      this.activeProjectID = project ? project._id! : null;
    });
  }

  toggleProjectAdmin(_toggleChange: { user: User, checked: boolean }) {

  }
}
