import { Type } from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';

import { Field } from '../field.decorator';

/**
 * A factory class to build DTO classes having a `data` field.
 */
@ArgsType()
export abstract class WithData<Data> {
  static for<Data>(type: () => Type<Data>): Type<WithData<Data>> {
    @ArgsType()
    class _WithData extends this<Data> {
      @Field(() => type(), { nested: true })
      data: Data;
    }

    return _WithData;
  }

  data: Data;
}
