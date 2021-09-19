import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';
import { Type as TransformType } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ValidationContextAttached } from '../validation/validation-context-attached.dto';

@ArgsType()
export class CreateOneArgs<Input> extends ValidationContextAttached {
  static of<Input>(type: Type<Input>): Type<CreateOneArgs<Input>> {
    @ArgsType()
    class Args extends this<Input> {
      @Field(() => type)
      @TransformType(() => type)
      data: Input;
    }

    return Args;
  }

  @ValidateNested()
  data: Input;
}
