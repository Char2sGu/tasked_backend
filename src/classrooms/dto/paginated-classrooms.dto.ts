import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Classroom } from '../entities/classroom.entity';

@ObjectType()
export class PaginatedClassrooms extends PaginatedDto.of(Classroom) {}
