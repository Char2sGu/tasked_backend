import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';
import { Type as TransformType } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { BodyContextAttached } from '../validation/body-context-attached.dto';

@ArgsType()
export class CreateOneArgs<Input> extends BodyContextAttached {
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
