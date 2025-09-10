import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePaths, AppFolder } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePaths(AppFolder.Auth),
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
