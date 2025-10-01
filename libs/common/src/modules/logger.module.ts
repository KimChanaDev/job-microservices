import { Module } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from "@nestjs/config";
import { isLocalEnv } from "../environment.config";


@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const isLocal = isLocalEnv(configService);
                return {
                    pinoHttp: {
                        transport: isLocal
                            ? {
                                target: 'pino-pretty',
                                options: {
                                    singleLine: true,
                                }
                            }
                            : undefined,
                        level: isLocal ? 'debug' : 'info'
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