import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../../shared/field.decorator';

/**
 * A base class to derive DTO classes with a `id` field.
 */
@ArgsType()
export class TargetedArgs {
  @Field(() => ID)
  id: number;
}
