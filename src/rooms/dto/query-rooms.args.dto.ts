import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithFilter } from 'src/common/dto/filter/with-filter.args.dto';
import { WithOrder } from 'src/common/dto/order/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { RoomFilterMap } from './room-filter-map.input.dto';
import { RoomOrderMap } from './room-order-map.input.dto';

@ArgsType()
export class QueryRoomsArgs extends IntersectionType(
  WithPagination,
  IntersectionType(
    WithOrder.for(() => RoomOrderMap),
    WithFilter.for(() => RoomFilterMap),
  ),
) {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Boolean, { nullable: true })
  isJoined?: boolean;
}
