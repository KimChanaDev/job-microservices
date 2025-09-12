import { NestFactory } from '@nestjs/core';
import { JobsModule } from './modules/jobs/jobs.module';
import { APPNAME, init } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(JobsModule);
  init(app, APPNAME.Jobs);
}
bootstrap();
