import { PulsarClient } from '@app/pulsar';
import { JobDecorator } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciMessage } from '@app/pulsar';
import { Jobs } from '@app/common';

@JobDecorator({
  name: Jobs.FIBONACCI,
  description: 'Calculates Fibonacci numbers',
})
export class FibonacciJob extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
