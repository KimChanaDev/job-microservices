import { Module } from '@nestjs/common';
import { PulsarModule } from '@app/pulsar';
import { ProductsConsumer } from '../jobs/products/products.consumer';

@Module({
    imports: [PulsarModule],
    providers: [ProductsConsumer],
})
export class ProductsModule { }
