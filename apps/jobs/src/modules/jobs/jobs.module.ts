import { Module } from '@nestjs/common';
import { JobsResolver } from './jobs.resolver';
import { JobsService } from './jobs.service';
import { AUTH_PACKAGE_NAME } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { PulsarModule } from '@app/pulsar';
import { FibonacciJob } from '../../jobs/fibonacci/fibonacci.job';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/auth.proto'),
        },
      },
    ]),
  ],
  controllers: [],
  providers: [FibonacciJob, JobsService, JobsResolver],
})
export class JobsModule { }
