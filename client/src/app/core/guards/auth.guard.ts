import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Only allows the user if they are an admin.
   */
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    // If no user present, does not have access, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }

    // Otherwise check to see if the user has the admin role
    return (
      this.authService.user.roles.admin || this.authService.user.roles.owner
    );
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Redirect any user that is not authenticated to login
   */
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Only allows the user if they are an admin.
   */
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    // If no user present, does not have access, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return false;
    }

    // Check to make sure the user is an owner
    return this.authService.user.roles.owner;
  }
}
