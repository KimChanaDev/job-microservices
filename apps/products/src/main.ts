import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products-app.module';
import { APPNAME, init } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule, { bufferLogs: true });
  await init(app, APPNAME.Products);
}
bootstrap();
