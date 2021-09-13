import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class UsersQueryArgs {
  @Field(() => Int, { nullable: true })
  @Max(100)
  @Min(1)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Max(2000)
  @Min(1)
  offset?: number;
}
