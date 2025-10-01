import { ConfigService } from "@nestjs/config"

export function isProdEnv(configService: ConfigService): boolean {
  const env = configService.getOrThrow<string>('NODE_ENV').toLowerCase();
  return env === 'production' || env === 'prod';
}

export function isLocalEnv(configService: ConfigService): boolean {
  return configService.getOrThrow<string>('NODE_ENV').toLowerCase() === 'local'
}