import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    return ctx.switchToHttp().getRequest().user;
  }

  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext().req.user;
});
