import { ConfigService } from "@nestjs/config"

export function getEnvironment(env: string, appName: APPNAME): string {
  return `${appName.toUpperCase()}_${env.toUpperCase()}`
}

export enum APPNAME {
  Auth = 'auth'
}

export function isProdEnv(configService: ConfigService): boolean {
  return configService.getOrThrow('NODE_ENV') === 'production' || configService.getOrThrow('NODE_ENV') === 'prod'
}