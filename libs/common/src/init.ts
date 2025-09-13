import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { APPNAME, getEnvironment, isProdEnv } from './environment.config';
import { GraphQLExceptionFilter } from '@app/graphql';

export async function init(app: INestApplication, appName: APPNAME) {
  const globalPrefix = 'api';
  // Configure global validation pipe with security and error handling settings
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    // whitelist: Remove properties not defined in DTO from request body (prevents mass assignment attacks)
    whitelist: true,
    // forbidNonWhitelisted: Send error when properties not defined in DTO are present (enhances security)
    forbidNonWhitelisted: true,
    // transform: Convert request body to DTO class instance and automatically transform data types
    transform: true,
    // disableErrorMessages: false = Show detailed error messages from class-validator (for development/debugging)
    disableErrorMessages: isProdEnv(configService),
  }));
  app.useGlobalFilters(new GraphQLExceptionFilter());
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  const port = configService.getOrThrow(getEnvironment('PORT', appName));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}/healthcheck`,
  );
}