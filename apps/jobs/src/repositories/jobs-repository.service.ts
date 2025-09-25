import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Prisma } from '@prisma/client/jobs/index.js';

@Injectable()
export class JobsRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async createJob(jobData: Prisma.jobsCreateInput) {
        return this.prismaService.jobs.create({
            data: jobData,
        });
    }

    async getJobs(): Promise<Prisma.jobsGetPayload<{}>[]> {
        return this.prismaService.jobs.findMany();
    }

    async getJob(id: number): Promise<Prisma.jobsGetPayload<{}> | null> {
        return this.prismaService.jobs.findUnique({
            where: { id },
        });
    }

    async updateJob(id: number, jobData: Prisma.jobsUpdateInput) {
        return this.prismaService.jobs.update({
            where: { id },
            data: jobData,
        });
    }

    async deleteJob(id: number) {
        return this.prismaService.jobs.delete({
            where: { id },
        });
    }
}