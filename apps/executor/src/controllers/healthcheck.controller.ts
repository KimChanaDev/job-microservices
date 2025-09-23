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
            service: 'executor-service',
            version: this.configService.getOrThrow("EXECUTOR_APP_VERSION"),
        };
    }
}
