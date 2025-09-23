import { NestFactory } from '@nestjs/core';
import { init } from '@app/common';
import { ExecutorAppModule } from './executor-app.module';
async function bootstrap() {
  const app = await NestFactory.create(ExecutorAppModule, { bufferLogs: true });
  init(app, "EXECUTOR_PORT");
}

bootstrap();
