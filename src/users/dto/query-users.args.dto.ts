import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { WithOrder } from 'src/mikro/order/with-order.args';

import { UserOrderMapInput } from './user-order-map.input.dto';

@ArgsType()
export class QueryUsersArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => UserOrderMapInput),
) {}
