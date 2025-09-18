import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Client, Consumer, Message, Producer } from 'pulsar-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client: Client;
  private readonly producers: Producer[] = [];
  private readonly consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL')
    });
  }

  async createProducer(topic: string): Promise<Producer> {
    const producer: Producer = await this.client.createProducer({
      topic,
    });
    this.producers.push(producer);
    return producer;
  }

  async createConsumer(
    topic: string,
    listener: (message: Message) => void
  ): Promise<Consumer> {
    const consumer: Consumer = await this.client.subscribe({
      topic,
      subscriptionType: 'Shared', // default is Exclusive which allows only one consumer per subscription, while Shared allows multiple consumers
      subscription: 'jobber',
      listener,
    });
    this.consumers.push(consumer);
    return consumer;
  }

  async onModuleDestroy() {
    for (const producer of this.producers) {
      await producer.close();
    }
    for (const consumer of this.consumers) {
      await consumer.close();
    }
    await this.client.close();
  }
}
