import { Module } from '@nestjs/common';
import { AuthenticationResolver } from '../resolvers/authentication.resolver';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationController } from '../controllers/authentication.controller';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject the ConfigService to useFactory
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('AUTH_JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.getOrThrow('AUTH_JWT_EXPIRATION_MS')),
        },
      }),
    }),
    UsersModule,
    ConfigModule
  ],
  providers: [AuthenticationResolver, AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController]
})
export class AuthenticationModule { }
