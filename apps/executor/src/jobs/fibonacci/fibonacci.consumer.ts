import { PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Injectable } from '@nestjs/common';
import { FibonacciMessage } from '@app/pulsar';
import { Jobs } from '@app/common';
const fibonacci = require('fibonacci');

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciMessage> {
  constructor(pulsarClient: PulsarClient) { super(pulsarClient, Jobs.FIBONACCI); }

  protected async onMessage(data: FibonacciMessage) {
    const result = fibonacci.iterate(data.iterations);
    this.logger.log(result);
  }
}
