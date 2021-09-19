import { Type } from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';

import { Field } from '../field.decorator';
import { ValidationContextAttached } from '../validation/validation-context-attached.dto';

@ArgsType()
export class CreateOneArgs<Input> extends ValidationContextAttached {
  static of<Input>(type: Type<Input>): Type<CreateOneArgs<Input>> {
    @ArgsType()
    class Args extends this<Input> {
      @Field(() => type, { nested: true })
      data: Input;
    }

    return Args;
  }

  data: Input;
}
