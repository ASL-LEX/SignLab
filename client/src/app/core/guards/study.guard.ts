import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StudyService } from '../services/study.service';

/**
 * Check to see if an active study is selected, if not, redirect to the study
 * list page.
 */
@Injectable()
export class StudyGuard implements CanActivate {
  constructor(private studyService: StudyService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.studyService.getActiveStudy()) {
      return true;
    }

    this.router.navigate(['/studies/select/']);
    return false;
  }
}
