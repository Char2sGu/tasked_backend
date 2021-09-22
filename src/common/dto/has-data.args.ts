import { Type } from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';

import { Field } from '../field.decorator';
import { ValidationContextAttached } from '../validation/validation-context-attached.dto';

@ArgsType()
export class HasDataArgs<Data> extends ValidationContextAttached {
  static for<Data>(type: Type<Data>): Type<HasDataArgs<Data>> {
    @ArgsType()
    class Args extends this<Data> {
      @Field(() => type, { nested: true })
      data: Data;
    }

    return Args;
  }

  data: Data;
}
