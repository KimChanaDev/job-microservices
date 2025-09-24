import { LoadProductsMessage, PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Jobs } from '@app/common';
import { Packages, PRODUCTS_SERVICE_NAME, ProductsServiceClient } from '@app/grpc';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AbstractJobConsumer } from '../abstract-job.consumer';

@Injectable()
export class ProductsConsumer extends AbstractJobConsumer<LoadProductsMessage> implements OnModuleInit {
  private productsService!: ProductsServiceClient;

  constructor(pulsarClient: PulsarClient, @Inject(Packages.PRODUCTS) private productClient: ClientGrpc, @Inject(Packages.JOBS) jobsClient: ClientGrpc) {
    super(Jobs.LOAD_PRODUCTS, pulsarClient, jobsClient);
  }

  async onModuleInit() {
    this.productsService = this.productClient.getService<ProductsServiceClient>(PRODUCTS_SERVICE_NAME);
    await super.onModuleInit();
  }

  protected async execute(message: LoadProductsMessage) {
    await firstValueFrom(this.productsService.createProduct(message));
  }
}
