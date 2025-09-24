import { PulsarClient, PulsarConsumer } from '@app/pulsar';
import { Inject, Injectable } from '@nestjs/common';
import { FibonacciMessage } from '@app/pulsar';
import { Jobs } from '@app/common';
import { AbstractJobConsumer } from '../abstract-job.consumer';
import type { ClientGrpc } from '@nestjs/microservices';
import { Packages } from '@app/grpc';
const fibonacci = require('fibonacci');


@Injectable()
export class FibonacciConsumer extends AbstractJobConsumer<FibonacciMessage> {
  constructor(pulsarClient: PulsarClient, @Inject(Packages.JOBS) jobsClient: ClientGrpc) {
    super(Jobs.FIBONACCI, pulsarClient, jobsClient);
  }

  protected async execute(data: FibonacciMessage) {
    const result = fibonacci.iterate(data.iterations);
    this.logger.log(result);
  }
}
