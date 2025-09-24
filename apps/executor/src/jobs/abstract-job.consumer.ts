import { AcknowledgeJobRequest, JOBS_SERVICE_NAME, JobsServiceClient } from "@app/grpc";
import { PulsarClient, PulsarConsumer } from "@app/pulsar";
import { OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

export abstract class AbstractJobConsumer<T extends AcknowledgeJobRequest> extends PulsarConsumer<T> implements OnModuleInit {
    private jobsService!: JobsServiceClient;

    constructor(topic: string, pulsarClient: PulsarClient, private readonly grpcClient: ClientGrpc) {
        super(pulsarClient, topic);
    }

    async onModuleInit() {
        this.jobsService = this.grpcClient.getService<JobsServiceClient>(JOBS_SERVICE_NAME);
        await super.onModuleInit();
    }

    protected async onMessage(message: T) {
        await this.execute(message);
        await firstValueFrom(this.jobsService.acknowledge(message));
    }

    protected async execute(message: T) { }
}
