import { InputType } from '@nestjs/graphql';
import { OrderMap } from 'src/common/dto/order-map.input';

import { Task } from '../entities/task.entity';

@InputType()
export class TaskOrderMap extends OrderMap.for(
  () => Task,
  ['id', 'title', 'description', 'createdAt', 'updatedAt'],
) {}
