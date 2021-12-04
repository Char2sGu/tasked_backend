import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';

import { MembershipOrderMap } from './membership-order-map.input.dto';

@ArgsType()
export class QueryMembershipsArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => MembershipOrderMap),
) {}
