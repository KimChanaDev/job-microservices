import { Module } from '@nestjs/common';
import { JobsResolver } from '../resolvers/jobs.resolver';
import { JobsService } from '../services/jobs.service';
import { AUTH_PACKAGE_NAME } from '@app/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { PulsarModule } from '@app/pulsar';
import { FibonacciJob } from '../jobs/fibonacci/fibonacci.job';
import { ConfigService } from '@nestjs/config';
import { getEnvironment, APPNAME } from '@app/common';


@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_PACKAGE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, 'proto/auth.proto'),
            url: configService.get(getEnvironment('GRPC_URL', APPNAME.Jobs)) || 'localhost:5000',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [FibonacciJob, JobsService, JobsResolver],
})
export class JobsModule { }
