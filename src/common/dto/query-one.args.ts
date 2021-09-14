import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Allow } from 'class-validator';

@ArgsType()
export class QueryOneArgs {
  @Field(() => ID)
  @Allow()
  id: number;
}
