import { Packages } from "@app/grpc";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: Packages.JOBS,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: Packages.JOBS,
                        protoPath: join(__dirname, 'proto/jobs.proto'),
                        url: configService.get("JOBS_GRPC_URL") || 'localhost:5002',
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class JobClientsModule { }
