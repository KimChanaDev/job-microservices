import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { init } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductsAppModule, { bufferLogs: true });
  await init(app, "PRODUCTS_PORT");
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: Packages.PRODUCTS,
      protoPath: join(__dirname, 'proto/products.proto'),
      url: app.get(ConfigService).get("PRODUCTS_GRPC_URL") || '0.0.0.0:5000',
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
