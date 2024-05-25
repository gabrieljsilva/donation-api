import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAccess = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = GqlExecutionContext.create(ctx).getContext().req;
  return request['access'];
});
