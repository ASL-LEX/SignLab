import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly orgService: OrganizationService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    // Return HTTP context
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    // Return GraphQL context
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /**
   * Extension of the base JWT guard which is used to add the organization
   * context on the request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If the JWT activation fails, no need to continue
    const baseCanActivate = await super.canActivate(context);
    if (!baseCanActivate) {
      return baseCanActivate;
    }

    // Get the request and authenticated user
    const request = this.getRequest(context);
    const user = request.user;

    // If the user isn't present,

    // Add the organization to the context. Organization needs to be on
    // the user
    const organization = await this.orgService.findOne(user.organization);
    if (!organization) {
      throw new Error('User object is missing organization');
    }
    request.organization = organization;

    // Can now activate
    return true;
  }
}
