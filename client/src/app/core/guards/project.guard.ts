import { Injectable } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProjectSelectDialog } from 'src/app/shared/components/project-select-dialog.component';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private projectService: ProjectService, private dialog : MatDialog) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> {
    if (this.projectService.hasActiveProject()) {
      return of(true);
    }

    return this.openDialog();
  }

  private openDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ProjectSelectDialog, {
      width: '500px',
      data: {},
    });

    return dialogRef.afterClosed().pipe(
      map((selectedProject: any) => {
        return !!selectedProject;
      })
    );
  }
}
