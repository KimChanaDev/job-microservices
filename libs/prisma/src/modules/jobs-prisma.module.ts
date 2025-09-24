import { Module } from '@nestjs/common';
import { JobsPrismaService } from '../services/jobs-prisma.service';

@Module({
  providers: [JobsPrismaService],
  exports: [JobsPrismaService],
})
export class JobsPrismaModule { }
