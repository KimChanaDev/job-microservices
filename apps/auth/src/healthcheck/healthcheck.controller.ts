import { APPNAME, getEnvironment } from '@app/common';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('healthcheck')
export class HealthCheckController {

    constructor(private readonly configService: ConfigService) { }
    @Get()
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'auth-service',
            version: this.configService.get(getEnvironment("APP_VERSION", APPNAME.Auth)) || '1.0.0',
        };
    }
}
