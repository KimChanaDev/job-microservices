import { Module } from '@nestjs/common';
import { PulsarModule } from '@app/pulsar';
import { FibonacciConsumer } from '../jobs/fibonacci/fibonacci.consumer';

@Module({
    imports: [PulsarModule],
    providers: [FibonacciConsumer],
})
export class FibonacciModule { }
