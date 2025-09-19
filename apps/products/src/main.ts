import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { APPNAME, init } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsAppModule, { bufferLogs: true });
  await init(app, APPNAME.Products);
}
bootstrap();
