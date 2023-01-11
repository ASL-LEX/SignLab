import { Injectable } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

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

    return of(false);
  }
}
