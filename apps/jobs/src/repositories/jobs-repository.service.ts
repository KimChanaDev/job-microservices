import { Injectable } from '@nestjs/common';
import { JobsPrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client/jobs/index.js';

@Injectable()
export class JobsRepository {
    constructor(private readonly jobsPrismaService: JobsPrismaService) { }

    async createJob(jobData: Prisma.jobsCreateInput) {
        return this.jobsPrismaService.jobs.create({
            data: jobData,
        });
    }

    async getJobs() {
        return this.jobsPrismaService.jobs.findMany();
    }

    async getJob(id: number): Promise<Prisma.jobsGetPayload<{}> | null> {
        return this.jobsPrismaService.jobs.findUnique({
            where: { id },
        });
    }

    async updateJob(id: number, jobData: Prisma.jobsUpdateInput) {
        return this.jobsPrismaService.jobs.update({
            where: { id },
            data: jobData,
        });
    }

    async deleteJob(id: number) {
        return this.jobsPrismaService.jobs.delete({
            where: { id },
        });
    }
}