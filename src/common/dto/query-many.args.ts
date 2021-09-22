import { ArgsType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

import { Field } from '../field.decorator';

@ArgsType()
export class QueryManyArgs {
  @Field(() => Int, { defaultValue: 50 })
  @Max(100)
  @Min(1)
  limit: number;

  @Field(() => Int, { nullable: true })
  @Max(2000)
  @Min(1)
  offset?: number;
}
