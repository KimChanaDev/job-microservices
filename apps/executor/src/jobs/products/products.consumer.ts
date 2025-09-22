import { LoadProductsMessage, PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Injectable } from '@nestjs/common';
import { Jobs } from '@app/common';

@Injectable()
export class ProductsConsumer extends PulsarConsumer<LoadProductsMessage> {
  constructor(pulsarClient: PulsarClient) { super(pulsarClient, Jobs.LOAD_PRODUCTS); }

  protected async onMessage(message: LoadProductsMessage) {
    console.log(message);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('Done processing product job');
  }
}
