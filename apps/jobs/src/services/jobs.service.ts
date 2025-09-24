import { Injectable, OnModuleInit, } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService, } from '@golevelup/nestjs-discovery';
import { JOB_METADATA_KEY } from '../decorators/job.decorator';
import { JobMetadata } from '../interfaces/job-metadata.interface';
import { AbstractJob } from '../jobs/abstract.job';
import { BadRequestException, InternalServerErrorException } from '@app/common';
import { readFileSync } from 'fs';
import { UPLOAD_FILE_PATH } from '../consts/upload.const';
import { JobsRepository } from '../repositories/jobs-repository.service';
import { Prisma } from '@prisma/client/jobs/index.js';
import { JobStatusEnum } from '../enums/jobs.enum';


@Injectable()
export class JobsService implements OnModuleInit {
    private jobs: DiscoveredClassWithMeta<JobMetadata>[] = [];
    constructor(private readonly discoveryService: DiscoveryService, private readonly jobsRepository: JobsRepository) { }

    async onModuleInit() {
        this.jobs = await this.discoveryService.providersWithMetaAtKey<JobMetadata>(JOB_METADATA_KEY);
    }

    getJobs() {
        return this.jobs.map((job) => job.meta);
    }

    async executeJob(name: string, data: any) {
        const job = this.jobs.find((job) => job.meta.name === name);
        if (!job) {
            throw new BadRequestException(`Job not found: ${name}`);
        }
        if (!(job.discoveredClass.instance instanceof AbstractJob)) {
            throw new InternalServerErrorException('Job is not an instance of AbstractJob');
        }
        const executeData = data.fileName ? this.getFile(data.fileName as string) || data : data;
        await job.discoveredClass.instance.execute(executeData, job.meta.name);
        return job.meta;
    }

    private getFile(fileName?: string) {
        if (!fileName) return null;
        try {
            const filePath = `${UPLOAD_FILE_PATH}/${fileName}`;
            return JSON.parse(readFileSync(filePath, 'utf-8'));
        } catch {
            throw new InternalServerErrorException(`Error reading file: ${fileName}`);
        }
    }

    public async acknowledge(jobId: number): Promise<Prisma.jobsGetPayload<{}> | null | void> {
        const job: Prisma.jobsGetPayload<{}> | null = await this.jobsRepository.getJob(jobId);
        if (!job) {
            throw new BadRequestException(`Job with ID ${jobId} not found.`);
        }
        if (job.endedAt) {
            return;
        }

        let updatedJob = await this.jobsRepository.updateJob(jobId, { completed: { increment: 1 } });
        if (updatedJob.completed === job.size) {
            updatedJob = await this.jobsRepository.updateJob(jobId, { status: JobStatusEnum.COMPLETED, endedAt: new Date() });
        }
        return updatedJob;
    }
}