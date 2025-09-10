import { Module } from '@nestjs/common';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject the ConfigService to useFactory
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION_MS'),
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
