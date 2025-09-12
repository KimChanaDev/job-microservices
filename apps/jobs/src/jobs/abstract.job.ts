import { Producer } from 'pulsar-client';
import { PulsarClient } from '@app/pulsar';
import { serialize } from '@app/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer | undefined;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) { }

  async execute(data: T, job: string) {
    await this.validateData(data);
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    if (Array.isArray(data)) {
      for (const message of data) {
        await this.send(message); // Pulsar will automatically batch all message even if it is looping one at a time.
      }
    } else {
      await this.send(data);
    }
  }

  private async send(message: T) {
    await this.producer?.send({ data: serialize(message) });
  }

  private async validateData(data: T) {
    const instance = plainToInstance(this.messageClass, { data }); // convert data to T class
    const errors = await validate(instance);

    if (errors.length) {
      throw new BadRequestException(
        `Job data is invalid ${JSON.stringify(errors)}`
      );
    }
  }
}
