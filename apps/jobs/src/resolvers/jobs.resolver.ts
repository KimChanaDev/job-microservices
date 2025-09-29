import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobMetadataModel } from '../models/job-metadata.model';
import { JobsService } from '../services/jobs.service';
import { ExecuteJobInput } from '../dtos/execute-job.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuardForExternalService } from '@app/graphql';
import { JobStatusModel } from '../models/job-status.model';

@Resolver()
export class JobsResolver {
    constructor(private readonly jobsService: JobsService) { }

    @Query(() => [JobMetadataModel], { name: 'jobsMetadata' })
    @UseGuards(GqlAuthGuardForExternalService)
    async getJobMetadatas() {
        return this.jobsService.getJobsMetadata();
    }


    @Query(() => [JobStatusModel], { name: 'jobs' })
    @UseGuards(GqlAuthGuardForExternalService)
    async getJobs() {
        return this.jobsService.getJobsStatus();
    }

    @Query(() => JobStatusModel, { name: 'job', })
    @UseGuards(GqlAuthGuardForExternalService)
    async getJob(@Args('id') id: number): Promise<JobStatusModel> {
        return this.jobsService.getJobStatus(id);
    }

    @Mutation(() => JobStatusModel)
    @UseGuards(GqlAuthGuardForExternalService)
    async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
        return this.jobsService.executeJob(
            executeJobInput.name,
            executeJobInput.data
        );
    }
}
