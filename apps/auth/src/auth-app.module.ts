import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { UsersModule } from './modules/users.module';
import { AuthenticationModule } from './modules/authentication.module';
import { HealthCheckController } from './controllers/healthcheck.controller';
import { GqlContext, gqlLoggingPlugin } from '@app/graphql';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      context: ({ req, res }: GqlContext) => ({ req, res }),
      autoSchemaFile: true,
      useGlobalPrefix: true,
      plugins: [
        gqlLoggingPlugin()
      ],
    }),
    UsersModule,
    AuthenticationModule
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AuthAppModule { }
