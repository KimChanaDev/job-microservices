import { NestFactory } from '@nestjs/core';
import { AuthAppModule } from './auth-app.module';
import { init } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { GraphQLExceptionFilter } from '@app/graphql';

async function bootstrap() {
  const app = await NestFactory.create(AuthAppModule, { bufferLogs: true });
  app.useGlobalFilters(new GraphQLExceptionFilter());
  init(app, "AUTH_PORT", "auth");
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: Packages.AUTH,
      protoPath: join(__dirname, 'proto/auth.proto'),
      url: app.get(ConfigService).get("AUTH_GRPC_URL") || '0.0.0.0:5000',
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
