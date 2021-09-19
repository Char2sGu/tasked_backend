import { Type } from '@nestjs/common';
import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Type as TransformType } from 'class-transformer';
import { Allow, ValidateNested } from 'class-validator';

@ArgsType()
export class UpdateOneArgs<Input> {
  static of<Input>(type: Type<Input>): Type<UpdateOneArgs<Input>> {
    @ArgsType()
    class Args extends UpdateOneArgs<Input> {
      @Field(() => type)
      @TransformType(() => type)
      data: Input;
    }

    return Args;
  }

  @Field(() => ID)
  @Allow()
  id: number;

  @ValidateNested()
  data: Input;
}
