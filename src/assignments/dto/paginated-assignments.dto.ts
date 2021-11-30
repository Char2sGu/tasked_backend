import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.dto';

import { Assignment } from '../entities/assignment.entity';

@ObjectType()
export class PaginatedAssignments extends Paginated.for(() => Assignment) {}
