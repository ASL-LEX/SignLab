import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ProjectGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body = context.switchToHttp().getRequest().body;

    // If the project is not attached, cannot active
    if (!body.projectID) {
      console.debug('ProjectGuard: no projectID');
      return false;
    }

    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      console.debug('ProjectGuard: no user');
      return false;
    }

    return user.roles.owner || user.roles.projectAdmin[body.projectID];
  }
}
