import { Module } from '@nestjs/common';
import { PulsarModule } from '@app/pulsar';
import { FibonacciConsumer } from '../jobs/fibonacci/fibonacci.consumer';
import { JobClientsModule } from './job-clients.module';

@Module({
    imports: [
        PulsarModule,
        JobClientsModule,
    ],
    providers: [FibonacciConsumer],
})
export class FibonacciModule { }
