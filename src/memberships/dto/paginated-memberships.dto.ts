import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.dto';

import { Membership } from '../entities/membership.entity';

@ObjectType()
export class PaginatedMemberships extends Paginated.for(() => Membership) {}
