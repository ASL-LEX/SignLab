import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StudyService } from '../services/study.service';
import { StudySelectDialog } from '../../shared/components/study-select-dialog.component';
import { Observable, of, map } from 'rxjs';

/**
 * Check to see if an active study is selected, if not, redirect to the study
 * list page.
 */
@Injectable()
export class StudyGuard implements CanActivate {
  constructor(private studyService: StudyService, private dialog: MatDialog) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {

    return this.openDialog();
  }

  private openDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(StudySelectDialog, {
      width: '500px',
      data: {},
    });

    return dialogRef.afterClosed().pipe(map((selectedStudy: any) => {
      return !!selectedStudy;
    }));
  }
}
