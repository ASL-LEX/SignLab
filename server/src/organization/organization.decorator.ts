import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const OrganizationContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    return ctx.switchToHttp().getRequest().organization;
  }

  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext().req.organization;
});
