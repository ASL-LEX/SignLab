import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyService } from '../../../core/services/study.service';
import { StudySelectDialog } from './study-select-dialog.component';
import { Study } from 'shared/dtos/study.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'studies-control',
  templateUrl: './studies-control.component.html',
  styleUrls: ['./studies-control.component.css'],
})
export class StudiesControlComponent {
  /** List of all studies loaded from backend */
  studies: Study[] = [];
  /** The current study that is being displayed to the user */
  activeStudy: Study | null = null;
  /** Which study control view is active */
  activeView: 'responses' | 'users' | 'tags' = 'responses';

  constructor(
    private dialog: MatDialog,
    private studyService: StudyService,
    private router: Router
  ) {
    this.studyService.getStudies().then((studies) => {
      this.studies = studies;
      if (this.studies.length > 0) {
        this.activeStudy = this.studies[0];
      }
    });
  }

  /**
   * Open the study selector dialog for the user
   */
  async openStudySelectDialog() {
    const dialogOpenParams = {
      width: '400px',
      data: {
        studies: this.studies,
        activeStudy: this.activeStudy,
        newStudyOption: true,
      },
    };

    // Open the dialog and handle when a change takes place
    this.dialog
      .open(StudySelectDialog, dialogOpenParams)
      .afterClosed()
      .subscribe((selectedStudy: any) => {
        if (selectedStudy && selectedStudy.data) {
          this.activeStudy = selectedStudy.data;
        }
      });
  }

  /** Navigate to the new study page */
  newStudyNav() {
    this.router.navigate(['/new_study']);
  }

  /**
   * Download the exported tags as a CSV
   *
   * NOTE: This is a tempory feature for exporting information and
   *       will be changed in future versions
   */
  async exportTags() {
    if (!this.activeStudy) {
      return;
    }

    const tags = await this.studyService.getTags(this.activeStudy);

    // NOTE: Here is the bad, this logic should not be on the client side
    //       explicitly as such. However in the future this will be exported
    //       from a table.
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
      alert('No tags to export');
      return;
    }

    const headerElements = [
      'responseID',
      'videoURL',
      'study',
      'user',
      ...Object.keys(tags[0].study.tagSchema.dataSchema.properties),
    ];

    this.downloadFile(headerElements, flattenedData);
  }

  downloadFile(headerElements: string[], data: any[]) {
    const replacer = (_key: string, value: any) =>
      value === null ? '' : value; // specify how you want to handle null values here
    const csv = data.map((row) =>
      headerElements
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(headerElements.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `${this.activeStudy?.name}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  setActiveView(view: 'responses' | 'users' | 'tags') {
    this.activeView = view;
  }
}
