import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Client, Consumer, Message, Producer } from 'pulsar-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private client: Client | null = null;
  private readonly producers: Producer[] = [];
  private readonly consumers: Consumer[] = [];
  private readonly logger = new Logger(PulsarClient.name);

  constructor(private readonly configService: ConfigService) { }

  async createProducer(topic: string): Promise<Producer> {
    const client = await this.getClient();
    const producer: Producer = await client.createProducer({
      blockIfQueueFull: true,
      topic,
    });
    this.producers.push(producer);
    return producer;
  }

  async createConsumer(topic: string, listener: (message: Message) => void): Promise<Consumer> {
    let isSuccess = false;
    let consumer: Consumer;
    let retryCount = 0;
    const maxRetries = 5;

    while (!isSuccess && retryCount < maxRetries) {
      try {
        const client = await this.getClient();
        consumer = await client.subscribe({
          topic,
          subscriptionType: 'Shared',
          subscription: `jobber-${topic}`,
          listener,
          subscriptionInitialPosition: 'Earliest', // Start from earliest messages
          ackTimeoutMs: 30000, // 30 seconds acknowledgment timeout
        });
        isSuccess = true;
        this.logger.log('Consumer created successfully, topic: ' + topic);
        console.log('Consumer created successfully, topic: ' + topic);
      } catch (error) {
        retryCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Consumer ERROR (attempt ${retryCount}):`, errorMessage);
        this.logger.error(`Consumer ERROR (attempt ${retryCount}):`, errorMessage);

        if (retryCount < maxRetries) {
          console.log(`Waiting 5 seconds before retry ${retryCount + 1}...`);
          await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
        } else {
          throw new Error(`Failed to create consumer after ${maxRetries} attempts: ${errorMessage}`);
        }
      }
    }
    this.consumers.push(consumer!);
    return consumer!;
  }

  private async getClient(): Promise<Client> {
    if (!this.client) {
      let clientInitialized = false;
      let retryCount = 0;
      const maxRetries = 10;

      while (!clientInitialized && retryCount < maxRetries) {
        try {
          this.client = new Client({
            serviceUrl: this.configService.getOrThrow<string>('PULSAR_SERVICE_URL'),
            operationTimeoutSeconds: 30,
            ioThreads: 1, // thread for I/O operations (network operations)
            messageListenerThreads: 1, // thread for message listeners (processing messages)
          });
          this.logger.log('Pulsar client initialized successfully');
          console.log('Pulsar client initialized successfully');
          clientInitialized = true;
        } catch (error) {
          retryCount++;
          this.logger.error(`Failed to initialize Pulsar client (attempt ${retryCount}):`, error);
          console.error(`Failed to initialize Pulsar client (attempt ${retryCount}):`, error);

          if (retryCount < maxRetries) {
            console.log(`Waiting 3 seconds before retry ${retryCount + 1}...`);
            await new Promise(res => setTimeout(res, 3000));
          } else {
            throw error;
          }
        }
      }
    }
    return this.client!;
  }

  async onModuleDestroy() {
    for (const producer of this.producers) {
      await producer.close();
    }
    for (const consumer of this.consumers) {
      await consumer.close();
    }
    if (this.client) {
      await this.client.close();
    }
  }
}
