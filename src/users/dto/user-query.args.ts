import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class UserQueryArgs {
  @Field(() => ID)
  id: number;
}
