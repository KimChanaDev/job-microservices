import { LoadProductsMessage, PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Jobs } from '@app/common';
import { Packages, PRODUCTS_SERVICE_NAME, ProductsServiceClient } from '@app/grpc';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsConsumer extends PulsarConsumer<LoadProductsMessage> implements OnModuleInit {
  private productsService!: ProductsServiceClient;

  constructor(pulsarClient: PulsarClient, @Inject(Packages.PRODUCTS) private client: ClientGrpc) {
    super(pulsarClient, Jobs.LOAD_PRODUCTS);
  }

  async onModuleInit() {
    this.productsService = this.client.getService<ProductsServiceClient>(PRODUCTS_SERVICE_NAME);
    await super.onModuleInit();
  }

  protected async onMessage(message: LoadProductsMessage) {
    await firstValueFrom(this.productsService.createProduct(message));
  }
}
