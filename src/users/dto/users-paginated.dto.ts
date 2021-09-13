import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { User } from '../entities/user.entity';

@ObjectType()
export class UsersPaginated extends PaginatedDto {
  @Field(() => [User])
  results: User[];
}
