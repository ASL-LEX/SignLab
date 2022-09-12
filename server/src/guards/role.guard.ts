import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';

/**
 * Check to see if the endpoint is accessible to a give user. The following
 * rules are followed.
 *
 * 1. If no roles are associated with the endpoint, any user may access it
 * 2. If there are roles, but the session does not contain a user ID, the user
 *    cannot access it
 * 3. If there are roles and the sesion has a user ID, the user may access it
 *    if the user has at least one role in the list of roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the required roles are not defined, assume no access limit
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }

    // Otherwise, see if the user is authorized to access this endpoint
    return this.authService.isAuthorized(user, requiredRoles);
  }
}
