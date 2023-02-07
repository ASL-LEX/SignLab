import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { User } from 'shared/dtos/user.dto';
import { StudyService } from '../../core/services/study.service';
import { ProjectService } from '../../core/services/project.service';
import { UserStudy } from 'shared/dtos/userstudy.dto';
import { Study } from 'shared/dtos/study.dto';

/** TODO: Remove the need to cast to any on roles */
@Component({
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent {
  /** Information on the available users */
  users: UserStudy[] = [];
  /** The currently selected study ID */
  activeStudyID: string | null = null;
  /** The currently selected project ID */
  activeProjectID: string | null = null;
  displayedColumns = ['name', 'username', 'email', 'studyAdmin', 'studyVisible', 'contribute', 'taggingTrainingResults'];

  constructor(public studyService: StudyService, private projectService: ProjectService) {
    this.studyService.activeStudy.subscribe((study) => {
      this.activeStudyID = study ? study._id! : null;
      this.loadData(study);
    });

    this.projectService.activeProject.subscribe((project) => {
      this.activeProjectID = project ? project._id! : null;
    });
  }

  async toggleStudyAdmin(toggleChange: { user: User; change: MatSlideToggleChange }) {
    try {
      await this.studyService.changeAdminStatus(toggleChange.user, toggleChange.change.checked);
      (toggleChange.user.roles.studyAdmin as any)[this.activeStudyID!] = toggleChange.change.checked;
    } catch (error: any) {
      console.log('Failed to change admin status', error);
      (toggleChange.user.roles.studyAdmin as any)[this.activeStudyID!] = !toggleChange.change.checked;
    }

    toggleChange.change.source.checked = (toggleChange.user.roles.studyAdmin as any)[this.activeStudyID!];
  }

  async toggleContribute(toggleChange: { user: User; change: MatSlideToggleChange }) {
    try {
      await this.studyService.changeContributorStatus(toggleChange.user, toggleChange.change.checked);
      (toggleChange.user.roles.studyContributor as any)[this.activeStudyID!] = toggleChange.change.checked;
    } catch (error: any) {
      console.log('Failed to change contributor status', error);
      (toggleChange.user.roles.studyContributor as any).this.activeStudyID! = !toggleChange.change.checked;
    }

    toggleChange.change.source.checked = (toggleChange.user.roles.studyContributor as any)[this.activeStudyID!];
  }

  async toggleVisibility(_toggleChange: { user: User; change: MatSlideToggleChange }) {

  }

  /*!*
   * Download the training tags as a CSV
   *
   * NOTE: This is a tempory feature for exporting information and
   *       will be changed in future versions
   */
  async downloadUserTraining(user: User) {
    if (!this.activeStudyID) {
      return;
    }

    const tags = await this.studyService.getTrainingTags(user, this.activeStudyID);

    const flattenedData = tags.map((tag) => {
      return {
        entryID: tag.entry.entryID,
        mediaURL: tag.entry.mediaURL,
        study: tag.study.name,
        user: tag.user.username,
        ...tag.entry.meta,
        ...tag.info
      };
    });

    if (flattenedData.length == 0) {
      alert('No training data');
      return;
    }

    this.downloadFile(user, flattenedData);
  }

  private downloadFile(user: User, data: any[]) {
    const replacer = (_key: string, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${user.username}-training.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  private async loadData(study: Study | null) {
    if (study === null) {
      this.users = [];
      return;
    }

    this.users = await this.studyService.getUserStudies(study._id!);
  }
}
