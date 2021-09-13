import { ArgsType, Field, ID } from '@nestjs/graphql';

import { UserUpdateInput } from './user-update.input';

@ArgsType()
export class UserUpdateArgs {
  @Field(() => ID)
  id: number;

  @Field(() => UserUpdateInput)
  data: UserUpdateInput;
}
