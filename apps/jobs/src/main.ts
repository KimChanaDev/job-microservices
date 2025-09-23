import { NestFactory } from '@nestjs/core';
import { init } from '@app/common';
import { JobsAppModule } from './jobs-app.module';
import { GraphQLExceptionFilter } from '@app/graphql';

async function bootstrap() {
  const app = await NestFactory.create(JobsAppModule, { bufferLogs: true });
  app.useGlobalFilters(new GraphQLExceptionFilter());
  init(app, "JOBS_PORT");
}
bootstrap();
