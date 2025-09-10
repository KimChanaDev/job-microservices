import { existsSync } from "fs";
import { join } from "path";

export function getEnvFilePaths(appFolderName: AppFolder) {
  const appEnvPath = join(__dirname, `../../../apps/${appFolderName}/.env`); // For Development: looking for .env in the src folder
  const rootEnvPath = join(__dirname, '../../../.env'); // root .env as fallback
  const isExistingAppEnv = existsSync(appEnvPath);
  
  console.log("App .env path found:", appEnvPath);
  console.log("Root .env path:", rootEnvPath);

  return isExistingAppEnv ? [appEnvPath, rootEnvPath] : [rootEnvPath];
}


export enum AppFolder {
  Auth = 'auth'
}