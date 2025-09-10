import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenPayload } from '@app/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const payload: TokenPayload = GqlExecutionContext.create(context).getContext().req.user;
    return payload.userId;
  }
);
