import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyService } from '../../core/services/study.service';
import { Study } from 'shared/dtos/study.dto';
import { StudySelectDialog } from '../../admin-dashboard/components/studies-control/study-select-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { UserStudy } from 'shared/dtos/userstudy.dto';

@Component({
  selector: 'tagging-landing',
  templateUrl: './tagging-landing.component.html',
})
export class TaggingLanding implements OnInit {
  /** The study that the user is currently viewing */
  activeStudy: Study | null = null;
  /** The view that the user is seeing */
  activeView: 'info' | 'tagging' | 'training' = 'info';
  /** The representation of the user for the specific study */
  userStudy: UserStudy | null = null;

  constructor(
    private studyService: StudyService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.activeStudy = this.studyService.getActiveStudy();
  }

  ngOnInit(): void {
    if (!this.activeStudy) {
      this.openStudySelectDialog();
    }
    this.activeStudy = this.studyService.getActiveStudy();
    this.updateUserInformation();
  }

  /** Open the study select interface */
  openStudySelectDialog() {
    const dialogOpenParams = {
      width: '400px',
      data: {
        newStudyOption: false,
      },
    };

    this.dialog
      .open(StudySelectDialog, dialogOpenParams)
      .afterClosed()
      .subscribe((selectedStudy: any) => {
        // Update the active study
        if (selectedStudy && selectedStudy.data) {
          this.activeStudy = selectedStudy.data;
          this.updateUserInformation();
        }
      });
  }

  /** Change the interface view */
  setView(view: 'info' | 'tagging' | 'training') {
    this.activeView = view;
  }

  /**
   * Get the user for the currently selected study
   */
  private async updateUserInformation() {
    if (!this.activeStudy) {
      console.debug('No active study');
      return;
    }

    const user = this.authService.user;
    this.userStudy = await this.studyService.getUserStudy(
      user,
      this.activeStudy
    );
  }
}
