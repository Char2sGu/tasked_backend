import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Membership } from '../entities/membership.entity';

@ObjectType()
export class PaginatedMemberships extends PaginatedDto.for(Membership) {}
