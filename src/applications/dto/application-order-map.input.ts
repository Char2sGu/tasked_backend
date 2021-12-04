import { InputType } from '@nestjs/graphql';
import { OrderMap } from 'src/common/dto/order/order-map.input.dto';

import { Application } from '../entities/application.entity';

@InputType()
export class ApplicationOrderMap extends OrderMap.for(
  () => Application,
  ['id', 'message', 'status', 'createdAt', 'updatedAt'],
) {}
