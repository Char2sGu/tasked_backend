import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { User } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers extends PaginatedDto.for(User) {}
