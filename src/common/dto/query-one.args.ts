import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../field.decorator';

@ArgsType()
export class QueryOneArgs {
  @Field(() => ID)
  id: number;
}
