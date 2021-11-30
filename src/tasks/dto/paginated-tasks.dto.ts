import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.dto';

import { Task } from '../entities/task.entity';

@ObjectType()
export class PaginatedTasks extends Paginated.for(() => Task) {}
