import { Component, OnInit } from '@angular/core';
import { StudyService } from '../../core/services/study.service';
import { Study } from 'shared/dtos/study.dto';
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.studyService.activeStudy.subscribe(async (study: Study | null) => {
      if (study) {
        this.userStudy = await this.studyService.getUserStudy(
          this.authService.user,
          study
        );

        if (
          !this.userStudy.user.roles.studyContributor[this.userStudy.study._id!]
        ) {
          this.activeView = 'info';
        }
      }
    });
  }

  /** Change the interface view */
  setView(view: 'info' | 'tagging' | 'training') {
    this.activeView = view;
  }
}
