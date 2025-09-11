import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { HealthCheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: true,
    }),
    UsersModule,
    AuthenticationModule
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AuthModule { }
