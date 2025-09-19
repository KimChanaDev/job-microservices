import { OnModuleInit, CanActivate, ExecutionContext, Injectable, Inject, Logger, } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { Packages, AUTH_SERVICE_NAME, AuthServiceClient } from '@app/grpc';
import type { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuardForExternalService implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuardForExternalService.name);
  private authService!: AuthServiceClient;

  constructor(@Inject(Packages.AUTH) private readonly client: ClientGrpc) { }

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getRequest(context).cookies?.Authentication;
    if (!token) return false;
    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.getRequest(context).user = res;
        this.logger.log('current user: ', res);
        return true;
      }),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
