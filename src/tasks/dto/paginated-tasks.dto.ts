import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Task } from '../entities/task.entity';

@ObjectType()
export class PaginatedTasks extends PaginatedDto.for(() => Task) {}
