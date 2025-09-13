import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { APPNAME, getEnvironment, init } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { GraphQLExceptionFilter } from '@app/graphql';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalFilters(new GraphQLExceptionFilter());
  init(app, APPNAME.Auth);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/auth.proto'),
      url: app.get(ConfigService).get(getEnvironment('GRPC_URL', APPNAME.Auth)) || '0.0.0.0:5000',
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
