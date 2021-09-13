import { AnyEntity } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class PaginatedDto {
  @Field(() => Int)
  total: number;

  abstract results: AnyEntity[];
}
