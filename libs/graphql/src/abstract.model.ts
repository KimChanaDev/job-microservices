import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class AbstractModel {
  @Field(() => ID)
  id!: number;
}
