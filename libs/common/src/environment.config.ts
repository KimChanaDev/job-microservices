import { ConfigService } from "@nestjs/config"

export function isProdEnv(configService: ConfigService): boolean {
  return configService.getOrThrow('NODE_ENV') === 'production' || configService.getOrThrow('NODE_ENV') === 'prod'
}

export function isDevEnv(configService: ConfigService): boolean {
  return configService.getOrThrow('NODE_ENV') === 'development' || configService.getOrThrow('NODE_ENV') === 'dev'
}