import { Jobs } from "@app/common";
import { JobDecorator } from "../../decorators/job.decorator";
import { AbstractJob } from "../abstract.job";
import { LoadProductsMessage, PulsarClient } from "@app/pulsar";
import { PrismaService } from "../../services/prisma.service";

@JobDecorator({
    name: Jobs.LOAD_PRODUCTS,
    description: 'Load products data into the database after enrichment.',
})
export class LoadProductsJob extends AbstractJob<LoadProductsMessage> {
    protected messageClass = LoadProductsMessage;

    constructor(pulsarClient: PulsarClient, prismaService: PrismaService) {
        super(pulsarClient, prismaService);
    }
}
