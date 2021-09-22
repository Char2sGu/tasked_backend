import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../field.decorator';

@ArgsType()
export class TargetedArgs {
  @Field(() => ID)
  id: number;
}
