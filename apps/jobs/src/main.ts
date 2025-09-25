import { NestFactory } from '@nestjs/core';
import { init } from '@app/common';
import { JobsAppModule } from './jobs-app.module';
import { GraphQLExceptionFilter } from '@app/graphql';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
import { join } from 'path/win32';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(JobsAppModule, { bufferLogs: true });
  app.useGlobalFilters(new GraphQLExceptionFilter());
  init(app, "JOBS_PORT", "jobs");
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: Packages.JOBS,
      protoPath: join(__dirname, 'proto/jobs.proto'),
      url: app.get(ConfigService).get("JOBS_GRPC_URL") || '0.0.0.0:5002',
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
