import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { StudyService } from '../../../../core/services/study.service';
import { Study } from 'shared/dtos/study.dto';
import { UserStudy } from 'shared/dtos/userstudy.dto';

@Component({
  selector: 'user-study-control',
  templateUrl: './user-study-control.component.html',
  styleUrls: ['./user-study-control.component.css'],
})
export class UserStudyComponent implements OnInit, OnChanges {
  @Input() study: Study;
  displayedColumns = [
    'username',
    'name',
    'email',
    'taggingTrainingResults',
    'canTag',
  ];
  userData: UserStudy[] = [];

  constructor(private studyService: StudyService) {}

  ngOnInit(): void {
    this.loadUserStudies();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.study) {
      this.study = changes.study.currentValue;
      this.loadUserStudies();
    }
  }

  async changeAccessToStudy(userStudy: UserStudy, hasAccess: boolean) {
    const result = await this.studyService.changeAccessToStudy(
      userStudy,
      hasAccess
    );

    if (!result) {
      console.error('Failed to change permission on user study');
      userStudy.hasAccessToStudy = !hasAccess;
    }
  }

  /**
   * Download the training tags as a CSV
   *
   * NOTE: This is a tempory feature for exporting information and
   *       will be changed in future versions
   */
  async downloadUserTraining(userStudy: UserStudy) {
    const tags = await this.studyService.getTrainingTags(userStudy);

    const flattenedData = tags.map((tag) => {
      return {
        responseID: tag.response.responseID,
        videoURL: tag.response.videoURL,
        study: tag.study.name,
        user: tag.user.username,
        ...tag.response.meta,
        ...tag.info,
      };
    });

    if (flattenedData.length == 0) {
      alert('No training data');
      return;
    }

    this.downloadFile(userStudy, flattenedData);
  }

  downloadFile(userStudy: UserStudy, data: any[]) {
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

  private async loadUserStudies() {
    // Do nothing if study is not defined
    if (!this.study) {
      return;
    }

    this.userData = await this.studyService.getUserStudies(this.study._id!);
  }
}
