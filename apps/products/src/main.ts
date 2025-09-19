import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { APPNAME, getEnvironment, init } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductsAppModule, { bufferLogs: true });
  await init(app, APPNAME.Products);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: Packages.PRODUCTS,
      protoPath: join(__dirname, 'proto/products.proto'),
      url: app.get(ConfigService).get(getEnvironment('GRPC_URL', APPNAME.Products)) || '0.0.0.0:5000',
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
