import { PulsarClient } from '@app/pulsar';
import { JobDecorator } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { FibonacciMessage } from '@app/pulsar';
import { Jobs } from '@app/common';
import { PrismaService } from '../../services/prisma.service';

@JobDecorator({
  name: Jobs.FIBONACCI,
  description: 'Calculates Fibonacci numbers',
})
export class FibonacciJob extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;

  constructor(pulsarClient: PulsarClient, prismaService: PrismaService) {
    super(pulsarClient, prismaService);
  }
}
