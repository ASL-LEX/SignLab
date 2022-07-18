import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';

/**
 * Interface that defined the necessary components in a session for handling
 * the role guard.
 */
interface RoleSession {
  userID?: string;
}

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

    // Next, check for user information
    const session: RoleSession = context.switchToHttp().getRequest().session;

    // If the user ID is not present, do not allow the user access
    if (!session.userID) {
      return false;
    }

    // Otherwise, see if the user is authorized to access this endpoint
    return await this.authService.isAuthorized(session.userID, requiredRoles);
  }
}
