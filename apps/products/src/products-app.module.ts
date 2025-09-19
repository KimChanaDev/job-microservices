import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './controllers/healthcheck.controller';
import { DatabaseModule } from './modules/database.module';
import { ProductsModule } from './modules/products.module';


@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductsModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class ProductsAppModule { }
