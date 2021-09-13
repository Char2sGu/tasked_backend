import { ArgsType, Field } from '@nestjs/graphql';

import { UserCreateInput } from './user-create.input';

@ArgsType()
export class UserCreateArgs {
  @Field(() => UserCreateInput)
  data: UserCreateInput;
}
