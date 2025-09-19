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
            service: 'products-service',
            version: this.configService.getOrThrow(getEnvironment("APP_VERSION", APPNAME.Products)),
        };
    }
}
