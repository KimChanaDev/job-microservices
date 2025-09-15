import { Module } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from "@nestjs/config";
import { isProdEnv } from "../environment.config";


@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const isProd = isProdEnv(configService);
                return {
                    pinoHttp: {
                        transport: isProd
                            ? undefined
                            : {
                                target: 'pino-pretty',
                                options: {
                                    singleLine: true,
                                }
                            },
                        level: isProd ? 'info' : 'debug'
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