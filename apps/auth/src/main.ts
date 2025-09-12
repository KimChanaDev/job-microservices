import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { APPNAME, init } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/grpc';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  init(app, APPNAME.Auth);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/auth.proto'),
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
