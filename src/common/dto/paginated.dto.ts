import { AnyEntity } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class PaginatedDto<Entity extends AnyEntity<Entity>> {
  static of<Entity extends AnyEntity<Entity>>(
    type: Type<Entity>,
  ): Type<PaginatedDto<Entity>> {
    @ObjectType()
    class Paginated extends this<Entity> {
      @Field(() => [type])
      results: Entity[];
    }

    return Paginated;
  }

  @Field(() => Int)
  total: number;

  results: AnyEntity[];
}
