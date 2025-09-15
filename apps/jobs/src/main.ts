import { NestFactory } from '@nestjs/core';
import { APPNAME, init } from '@app/common';
import { JobsAppModule } from './jobs-app.module';
import { GraphQLExceptionFilter } from '@app/graphql';

async function bootstrap() {
  const app = await NestFactory.create(JobsAppModule, { bufferLogs: true });
  app.useGlobalFilters(new GraphQLExceptionFilter());
  init(app, APPNAME.Jobs);
}
bootstrap();
