import { Module } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from "@nestjs/config";
import { isDevEnv } from "../environment.config";


@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const isDev = isDevEnv(configService);
                return {
                    pinoHttp: {
                        transport: isDev
                            ? {
                                target: 'pino-pretty',
                                options: {
                                    singleLine: true,
                                }
                            }
                            : undefined,
                        level: isDev ? 'debug' : 'info'
                    }
                }
            },
            inject: [ConfigService],
        }),

    ],
    providers: [],
    exports: []
})
export class LoggerModule { }