import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';
import { Allow } from 'class-validator';

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

  @Allow()
  data: Input;
}
