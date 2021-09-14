import { Type } from '@nestjs/common';
import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Allow } from 'class-validator';

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
  @Allow()
  id: number;

  @Allow()
  data: Input;
}
