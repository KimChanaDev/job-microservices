import { Module } from '@nestjs/common';
import { PulsarModule } from '@app/pulsar';
import { ProductsConsumer } from '../jobs/products/products.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { JobClientsModule } from './job-clients.module';

@Module({
    imports: [
        PulsarModule,
        JobClientsModule,
        ClientsModule.registerAsync([
            {
                name: Packages.PRODUCTS,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: Packages.PRODUCTS,
                        protoPath: join(__dirname, 'proto/products.proto'),
                        url: configService.get('PRODUCTS_GRPC_URL') || 'localhost:5000',
                    },
                }),
                inject: [ConfigService],
            }])
    ],
    providers: [ProductsConsumer],
})
export class ProductsModule { }
