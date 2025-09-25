import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JobStatusModel {
    @Field()
    id!: number;

    @Field()
    name!: string;

    @Field()
    size!: number;

    @Field()
    completed!: number;

    @Field()
    status!: string;

    @Field()
    startedAt!: Date;

    @Field(() => Date, { nullable: true })
    endedAt!: Date | null;
}
