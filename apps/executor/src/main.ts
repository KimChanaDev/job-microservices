import { NestFactory } from '@nestjs/core';
import { APPNAME, init } from '@app/common';
import { ExecutorModule } from './executor.module';
async function bootstrap() {
  const app = await NestFactory.create(ExecutorModule);
  init(app, APPNAME.Executor);
}

bootstrap();
