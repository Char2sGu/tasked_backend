import { Type } from '@nestjs/common';
import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class UpdateOneArgs<Input> {
  static of<Input>(type: Type<Input>): Type<UpdateOneArgs<Input>> {
    @ArgsType()
    class Args extends UpdateOneArgs<Input> {
      @Field(() => type)
      data: Input;
    }

    return Args;
  }

  @Field(() => ID)
  id: number;

  data: Input;
}
