import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudyService } from '../../core/services/study.service';
import { Study } from 'shared/dtos/study.dto';
import { StudySelectDialog } from '../../shared/components/study-select-dialog.component';
import { AuthService } from '../../core/services/auth.service';
import { UserStudy } from 'shared/dtos/userstudy.dto';

@Component({
  selector: 'tagging-landing',
  templateUrl: './tagging-landing.component.html',
})
export class TaggingLanding implements OnInit {
  /** The view that the user is seeing */
  activeView: 'info' | 'tagging' | 'training' = 'info';
  /** The representation of the user for the specific study */
  userStudy: UserStudy | null = null;

  constructor(
    public studyService: StudyService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.studyService.hasActiveStudy()) {
      this.selectActiveStudy();
    }

    this.studyService.activeStudy.subscribe(async (study: Study | null) => {
      if(study) {
        this.userStudy = await this.studyService.getUserStudy(
          this.authService.user,
          study
        );
      }
    });
  }

  async selectActiveStudy() {
    if (await this.studyService.hasStudies()) {
      this.openStudySelectDialog();
    }
  }

  /** Open the study select interface */
  openStudySelectDialog() {
    const dialogOpenParams = {
      width: '400px',
      data: {
        newStudyOption: false,
      },
    };

    this.dialog.open(StudySelectDialog, dialogOpenParams);
  }

  /** Change the interface view */
  setView(view: 'info' | 'tagging' | 'training') {
    this.activeView = view;
  }
}
