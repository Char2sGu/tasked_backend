import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class QueryOneArgs {
  @Field(() => ID)
  id: number;
}
