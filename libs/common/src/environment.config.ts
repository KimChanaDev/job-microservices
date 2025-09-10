export function getEnvironment(env: string, appName: APPNAME): string {
  return `${appName.toUpperCase()}_${env.toUpperCase()}`
}

export enum APPNAME {
  Auth = 'auth'
}