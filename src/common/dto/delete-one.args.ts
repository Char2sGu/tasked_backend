import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../field.decorator';

@ArgsType()
export class DeleteOneArgs {
  @Field(() => ID)
  id!: number;
}
