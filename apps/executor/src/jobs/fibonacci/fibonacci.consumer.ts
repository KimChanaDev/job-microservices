import { PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Injectable } from '@nestjs/common';
import { FibonacciData } from './fibonacci.interface';
const fibonacci = require('fibonacci');

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciData> {
  constructor(pulsarClient: PulsarClient) { super(pulsarClient, 'Fibonacci'); }

  protected async onMessage(data: FibonacciData) {
    const result = fibonacci.iterate(data.iterations);
    this.logger.log(result);
  }
}
