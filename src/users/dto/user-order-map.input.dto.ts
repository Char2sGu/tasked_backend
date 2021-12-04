import { InputType } from '@nestjs/graphql';
import { OrderMapInput } from 'src/common/dto/order-map.input';

import { User } from '../entities/user.entity';

@InputType()
export class UserOrderMapInput extends OrderMapInput.for(
  () => User,
  ['id', 'username', 'nickname'],
) {}
