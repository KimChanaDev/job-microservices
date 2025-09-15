import { CallHandler, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GrpcLoggingInterceptor {
    private readonly logger = new Logger(GrpcLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const handler = context.getHandler().name;
        const args = context.getArgs()[0];
        const startTime = Date.now();
        const requestId = uuidv4();

        return next.handle().pipe(
            tap({
                next: (response) => this.logger.log({
                    requestId,
                    handler,
                    args,
                    response,
                    duration: `${Date.now() - startTime}ms`
                }),
                error: (error) => this.logger.warn(`Error in gRPC request: ${error.message}`),
            }),
        );
    }
}