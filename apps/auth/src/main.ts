import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { init } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  init(app);
}
bootstrap();
