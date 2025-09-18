import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobModel } from '../models/job.model';
import { JobsService } from '../services/jobs.service';
import { ExecuteJobInput } from '../dtos/execute-job.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuardForExternalService } from '@app/graphql';

@Resolver()
export class JobsResolver {
    constructor(private readonly jobsService: JobsService) { }

    @Query(() => [JobModel], { name: 'jobs' })
    @UseGuards(GqlAuthGuardForExternalService)
    async getJobs() {
        return this.jobsService.getJobs();
    }

    @Mutation(() => JobModel)
    @UseGuards(GqlAuthGuardForExternalService)
    async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
        return this.jobsService.executeJob(
            executeJobInput.name,
            executeJobInput.data
        );
    }
}
