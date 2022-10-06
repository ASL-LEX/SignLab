import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Study } from 'shared/dtos/study.dto';
import { StudyService } from '../../core/services/study.service';
import {
  UserStudyToggleChange,
  UserTableElement,
} from '../models/user-table-element';
import { UserStudy } from 'shared/dtos/userstudy.dto';

@Component({
  selector: 'user-study-table',
  template: `
    <user-table-core
      [userData]="userData"
      [displayedColumns]="[
        'username',
        'name',
        'email',
        'taggingTrainingResults',
        'canTag'
      ]"
      (taggingChange)="changeAccessToStudy($event)"
      (downloadTrainingResultsRequest)="downloadUserTraining($event)"
    ></user-table-core>
  `,
})
export class UserStudyTable implements OnInit, OnChanges {
  /** The study of interest for this table */
  @Input()
  study: Study;
  /** The user information as well as the study information */
  userData: UserTableElement[] = [];

  constructor(private studyService: StudyService) {}

  ngOnInit(): void {
    this.loadUserStudies();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update the stored user information when the study changes
    if (changes.study) {
      this.study = changes.study.currentValue;
      this.loadUserStudies();
    }
  }

  /**
   * Load the user information associated with the given study
   */
  private async loadUserStudies() {
    // Do nothing if the study is not defined
    if (!this.study) {
      return;
    }

    this.userData = (
      await this.studyService.getUserStudies(this.study._id!)
    ).map((userStudy) => {
      return { user: userStudy.user, userStudy: userStudy };
    });
  }

  async changeAccessToStudy(userStudyToggle: UserStudyToggleChange) {
    const result = await this.studyService.changeAccessToStudy(
      userStudyToggle.userStudy,
      userStudyToggle.option
    );

    if (!result) {
      console.error('Failed to change permission on user study');
      userStudyToggle.userStudy.hasAccessToStudy = !userStudyToggle.option;
    }
  }

  /*!*
   * Download the training tags as a CSV
   *
   * NOTE: This is a tempory feature for exporting information and
   *       will be changed in future versions
   */
  async downloadUserTraining(user: UserTableElement) {
    const tags = await this.studyService.getTrainingTags(user.userStudy!);

    const flattenedData = tags.map((tag) => {
      return {
        entryID: tag.entry.entryID,
        videoURL: tag.entry.videoURL,
        study: tag.study.name,
        user: tag.user.username,
        ...tag.entry.meta,
        ...tag.info,
      };
    });

    if (flattenedData.length == 0) {
      alert('No training data');
      return;
    }

    this.downloadFile(user.userStudy!, flattenedData);
  }

  private downloadFile(userStudy: UserStudy, data: any[]) {
    const replacer = (_key: string, value: any) =>
      value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${userStudy.user.username}-training.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
