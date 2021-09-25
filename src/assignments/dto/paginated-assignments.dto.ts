import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Assignment } from '../entities/assignment.entity';

@ObjectType()
export class PaginatedAssignments extends PaginatedDto.for(() => Assignment) {}
