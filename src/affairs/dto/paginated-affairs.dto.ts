import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Affair } from '../entities/affair.entity';

@ObjectType()
export class PaginatedAffairs extends PaginatedDto.for(Affair) {}
