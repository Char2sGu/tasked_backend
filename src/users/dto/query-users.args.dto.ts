import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';

import { UserOrderMap } from './user-order-map.input.dto';

@ArgsType()
export class QueryUsersArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => UserOrderMap),
) {}
