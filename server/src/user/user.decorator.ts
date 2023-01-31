import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext().req.user;
});
