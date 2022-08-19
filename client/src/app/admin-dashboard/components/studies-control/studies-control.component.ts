import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyService } from '../../../core/services/study.service';
import { StudySelectDialog } from './study-select-dialog.component';
import { Study } from '../../../../../../shared/dtos/study.dto';

@Component({
  selector: 'studies-control',
  templateUrl: './studies-control.component.html',
  styleUrls: ['./studies-control.component.css']
})
export class StudiesControlComponent {
  /** List of all studies loaded from backend */
  studies: Study[] = [];
  /** The current study that is being displayed to the user */
  activeStudy: Study | null = null;
  /** Which study control view is active */
  activeView: "responses" | "users" | "tags" = "responses";

  constructor(private dialog: MatDialog, private studyService: StudyService) {
    this.studyService.getStudies()
      .then(studies => {
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
        newStudyOption: true
      }
    };

    // Open the dialog and handle when a change takes place
    this.dialog.open(StudySelectDialog, dialogOpenParams)
      .afterClosed()
      .subscribe((selectedStudy: any) => {
        if(selectedStudy && selectedStudy.data) {
          this.activeStudy = selectedStudy.data;
        }
      });
  }

  setActiveView(view: "responses" | "users" | "tags") {
    this.activeView = view;
  }
}
