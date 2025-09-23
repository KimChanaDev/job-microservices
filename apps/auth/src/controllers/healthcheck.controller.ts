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
            version: this.configService.getOrThrow("AUTH_APP_VERSION"),
        };
    }
}
