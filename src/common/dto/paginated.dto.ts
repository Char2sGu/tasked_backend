import { Type } from '@nestjs/common';
import { Int, ObjectType } from '@nestjs/graphql';

import { Field } from '../field.decorator';

@ObjectType()
export abstract class PaginatedDto<Entity> {
  static for<Entity>(type: Type<Entity>): Type<PaginatedDto<Entity>> {
    @ObjectType()
    class Paginated extends this<Entity> {
      @Field(() => [type])
      results: Entity[];
    }

    return Paginated;
  }

  @Field(() => Int)
  total: number;

  results: Entity[];
}
