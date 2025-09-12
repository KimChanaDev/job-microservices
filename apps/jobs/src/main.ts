import { NestFactory } from '@nestjs/core';
import { APPNAME, init } from '@app/common';
import { JobsAppModule } from './jobs-app.module';

async function bootstrap() {
  const app = await NestFactory.create(JobsAppModule);
  init(app, APPNAME.Jobs);
}
bootstrap();
