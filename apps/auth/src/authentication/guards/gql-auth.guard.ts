import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('jwt') {
    // extract the HTTP request object from the GraphQL execution context, ensuring authentication works with GraphQL resolvers.
    override getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
