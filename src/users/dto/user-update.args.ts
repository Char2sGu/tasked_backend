import { ArgsType, Field } from '@nestjs/graphql';
import { QueryOneArgs } from 'src/common/dto/query-one.args';

import { UserUpdateInput } from './user-update.input';

@ArgsType()
export class UserUpdateArgs extends QueryOneArgs {
  @Field(() => UserUpdateInput)
  data: UserUpdateInput;
}
