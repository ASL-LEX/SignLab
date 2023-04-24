import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ProjectGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const headers = request.headers;

    const user = request.user;
    if (!user) {
      console.debug('ProjectGuard: no user');
      return false;
    }

    const projectID = body.projectID || headers['projectid'];

    return user.roles.owner || (projectID && user.roles.projectAdmin.get(projectID));
  }
}
