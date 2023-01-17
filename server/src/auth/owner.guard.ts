import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }

    return user.roles.owner;
  }
}
