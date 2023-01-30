import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { User } from 'shared/dtos/user.dto';
import { UserService } from '../../core/services/user.service';
import { StudyService } from '../../core/services/study.service';
import { ProjectService } from '../../core/services/project.service';

@Component({
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent {
  /** Information on the available users */
  users: User[] = [];
  /** The currently selected study ID */
  activeStudyID: string | null = null;
  /** The currently selected project ID */
  activeProjectID: string | null = null;
  displayedColumns = ['name', 'username', 'email', 'studyAdmin', 'contribute'];

  constructor(
    public studyService: StudyService,
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.userService.getUsers().then((users) => {
      this.users = users;
    });

    this.studyService.activeStudy.subscribe((study) => {
      this.activeStudyID = study ? study._id! : null;
    });

    this.projectService.activeProject.subscribe((project) => {
      this.activeProjectID = project ? project._id! : null;
    });
  }

  async toggleStudyAdmin(toggleChange: { user: User; change: MatSlideToggleChange }) {
    try {
      await this.studyService.changeAdminStatus(toggleChange.user, toggleChange.change.checked);
      toggleChange.user.roles.studyAdmin[this.activeStudyID!] = toggleChange.change.checked;
    } catch (error: any) {
      console.log('Failed to change admin status', error);
      toggleChange.user.roles.studyAdmin[this.activeStudyID!] = !toggleChange.change.checked;
    }

    toggleChange.change.source.checked = toggleChange.user.roles.studyAdmin[this.activeStudyID!];
  }

  async toggleContribute(toggleChange: { user: User; change: MatSlideToggleChange }) {
    try {
      await this.studyService.changeContributorStatus(toggleChange.user, toggleChange.change.checked);
      toggleChange.user.roles.studyContributor[this.activeStudyID!] = toggleChange.change.checked;
    } catch (error: any) {
      console.log('Failed to change contributor status', error);
      toggleChange.user.roles.studyContributor[this.activeStudyID!] = !toggleChange.change.checked;
    }

    toggleChange.change.source.checked = toggleChange.user.roles.studyContributor[this.activeStudyID!];
  }
}
