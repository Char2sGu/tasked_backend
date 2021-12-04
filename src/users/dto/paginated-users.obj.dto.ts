import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.obj.dto';

import { User } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers extends Paginated.for(() => User) {}
