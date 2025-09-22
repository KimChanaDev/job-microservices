import { Producer } from 'pulsar-client';
import { PulsarClient } from '@app/pulsar';
import { serialize } from '@app/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@app/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer | undefined;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) { }

  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    if (Array.isArray(data)) {
      for (const message of data) {
        this.send(message); // Pulsar will automatically batch all message even if it is looping one at a time.
      }
    } else {
      this.send(data);
    }
  }

  private send(message: T) {
    this.validateData(message).then(() => {
      this.producer!.send({ data: serialize(message) });
    });
  }

  private async validateData(message: T) {
    const instance = plainToInstance(this.messageClass, message); // convert data to T class
    const errors = await validate(instance);

    if (errors.length) {
      throw new BadRequestException(`Job data is invalid ${JSON.stringify(errors)}`);
    }
  }
}
