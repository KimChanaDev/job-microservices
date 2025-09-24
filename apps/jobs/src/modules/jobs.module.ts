import { Module } from '@nestjs/common';
import { JobsResolver } from '../resolvers/jobs.resolver';
import { JobsService } from '../services/jobs.service';
import { Packages } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { PulsarModule } from '@app/pulsar';
import { FibonacciJob } from '../jobs/fibonacci/fibonacci.job';
import { ConfigService } from '@nestjs/config';
import { LoadProductsJob } from '../jobs/products/load-products.job';
import { PrismaModule } from './prisma.module';
import { JobsController } from '../controllers/jobs.controller';
import { JobsRepository } from '../repositories/jobs-repository.service';


@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: Packages.AUTH,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: Packages.AUTH,
            protoPath: join(__dirname, 'proto/auth.proto'),
            url: configService.get("AUTH_GRPC_URL") || 'localhost:5000',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PrismaModule
  ],
  controllers: [JobsController],
  providers: [FibonacciJob, JobsService, JobsRepository, JobsResolver, LoadProductsJob],
})
export class JobsModule { }
