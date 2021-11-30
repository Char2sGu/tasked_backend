import { ArgsType, ID } from '@nestjs/graphql';

import { Field } from '../field.decorator';

/**
 * A base class to derive DTO classes with a `id` field.
 */
@ArgsType()
export abstract class WithId {
  @Field(() => ID)
  id: number;
}
