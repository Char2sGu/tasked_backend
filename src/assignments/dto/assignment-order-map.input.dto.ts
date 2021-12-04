import { InputType } from '@nestjs/graphql';
import { OrderMap } from 'src/common/dto/order/order-map.input.dto';

import { Assignment } from '../entities/assignment.entity';

@InputType()
export class AssignmentOrderMap extends OrderMap.for(
  () => Assignment,
  ['id', 'isCompleted', 'isImportant', 'createdAt', 'updatedAt'],
) {}
