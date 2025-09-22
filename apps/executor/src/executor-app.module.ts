import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './modules/jobs.module';
import { HealthCheckController } from './controllers/healthcheck.controller';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JobsModule
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class ExecutorAppModule { }
