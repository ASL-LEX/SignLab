import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

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
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  /*
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);


    // If the required roles are not defined, assume no access limit
    if (!requiredRoles) {
      return true;
    }

    console.log(context);

    // Next, check for user information
    const session: RoleSession = context.switchToHttp().getRequest().session;

    // If the user ID is not present, do not allow the user access
    if (!session.userID) {
      return false;
    }

    // Otherwise, see if the user is authorized to access this endpoint
    return this.authService.isAuthorized(session.userID, requiredRoles);
  }
  */

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log(user);

    return user;
  }
}
