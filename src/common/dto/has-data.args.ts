import { Type } from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';

import { Field } from '../field.decorator';

/**
 * A factory class to build DTO classes having a `data` field.
 */
@ArgsType()
export class HasDataArgs<Data> {
  static for<Data>(type: () => Type<Data>): Type<HasDataArgs<Data>> {
    @ArgsType()
    class Args extends this<Data> {
      @Field(() => type(), { nested: true })
      data: Data;
    }

    return Args;
  }

  data: Data;
}
