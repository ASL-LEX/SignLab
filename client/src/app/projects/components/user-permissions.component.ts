import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';
import { ProjectAdminChangeGQL } from '../../graphql/projects/projects.generated';
import { User } from '../../graphql/graphql';

@Component({
  selector: 'project-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent {
  /**
   * The ID of the current project, this is used to determine the target
   * project to change the permissions of.
   */
  activeProjectID: string | null;
  /** The list of all users */
  users: User[] = [];

  displayedColumns = ['name', 'username', 'email', 'projectAdmin'];

  constructor(
    public readonly projectService: ProjectService,
    public readonly userService: UserService,
    private readonly projectAdminChangeGQL: ProjectAdminChangeGQL
  ) {
    /** Update activeProjectID when the active project changes. */
    projectService.activeProject.subscribe((project) => {
      this.activeProjectID = project ? project._id! : null;
    });

    userService.getUsers().then((users) => {
      this.users = users;
    });
  }

  async toggleProjectAdmin(toggleChange: { user: User; change: MatSlideToggleChange }) {
    this.projectAdminChangeGQL
      .mutate({
        projectAdminChange: {
          userID: toggleChange.user._id,
          projectID: this.activeProjectID!,
          hasAdminAccess: toggleChange.change.checked
        }
      })
      .subscribe((result) => {
        if (result.errors) {
          // Log the error
          console.error('Failed to change admin status');
          console.error(result.errors);

          // Revert the toggle
          toggleChange.change.source.checked = !toggleChange.change.checked;
        } else {
          // Update the user object to reflect the toggle
          (toggleChange.user.roles.projectAdmin as any)[this.activeProjectID!] = toggleChange.change.checked;
        }
      });
  }
}
