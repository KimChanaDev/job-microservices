import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { HealthCheckController } from './controllers/healthcheck.controller';
import { GqlContext } from '@app/graphql';
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
    }),
    UsersModule,
    AuthenticationModule
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AuthAppModule { }
