import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JobMetadataModel {
    @Field()
    name!: string;

    @Field()
    description!: string;
}
