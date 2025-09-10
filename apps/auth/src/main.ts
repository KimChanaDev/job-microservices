import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { APPNAME, init } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  init(app, APPNAME.Auth);
}
bootstrap();
