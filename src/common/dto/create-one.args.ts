import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateOneArgs<Input> {
  static of<Input>(type: Type<Input>): Type<CreateOneArgs<Input>> {
    @ArgsType()
    class Args extends this<Input> {
      @Field(() => type)
      data: Input;
    }

    return Args;
  }

  data: Input;
}
