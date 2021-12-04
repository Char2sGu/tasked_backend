import { InputType } from '@nestjs/graphql';
import { OrderMap } from 'src/common/dto/order-map.input';

import { User } from '../entities/user.entity';

@InputType()
export class UserOrderMap extends OrderMap.for(
  () => User,
  ['id', 'username', 'nickname'],
) {}
