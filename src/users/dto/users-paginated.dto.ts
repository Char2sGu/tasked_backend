import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '../entities/user.entity';

@ObjectType()
export class UsersPaginated {
  @Field(() => Int)
  total: number;

  @Field(() => [User])
  results: User[];
}
