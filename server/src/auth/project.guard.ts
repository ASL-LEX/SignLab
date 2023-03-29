import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ProjectGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body = context.switchToHttp().getRequest().body;

    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      console.debug('ProjectGuard: no user');
      return false;
    }

    return user.roles.owner || (body.projectID && user.roles.projectAdmin[body.projectID]);
  }
}
