import { PulsarClient } from '@app/pulsar';
import { JobDecorator } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciMessage } from './fibonacci-data.message';
@JobDecorator({
  name: 'Fibonacci',
  description: 'Calculates Fibonacci numbers',
})
export class FibonacciJob extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
