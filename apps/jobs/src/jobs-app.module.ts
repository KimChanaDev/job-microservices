import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { HealthCheckController } from './controllers/healthcheck.controller';
import { JobsModule } from './modules/jobs.module';
import { LoggerModule } from '@app/common';
import { gqlLoggingPlugin } from '@app/graphql';
import { UploadsModule } from './modules/uploads.module';
import { JobsPrismaModule } from '@app/prisma';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: true,
      plugins: [
        gqlLoggingPlugin()
      ],
    }),
    JobsModule,
    UploadsModule,
    JobsPrismaModule
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class JobsAppModule { }
