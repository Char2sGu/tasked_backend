import { Type } from '@nestjs/common';
import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../field.decorator';

@ArgsType()
export class UpdateOneArgs<Input> {
  static of<Input>(type: Type<Input>): Type<UpdateOneArgs<Input>> {
    @ArgsType()
    class Args extends UpdateOneArgs<Input> {
      @Field(() => type, { nested: true })
      data: Input;
    }

    return Args;
  }

  @Field(() => ID)
  id: number;

  data: Input;
}
