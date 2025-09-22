import { Module } from '@nestjs/common';
import { PulsarModule } from '@app/pulsar';
import { ProductsModule } from './products.module';
import { FibonacciModule } from './fibonacci.module';

@Module({
    imports: [ProductsModule, FibonacciModule],
    providers: [],
})
export class JobsModule { }
