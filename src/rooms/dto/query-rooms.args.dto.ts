import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { RoomOrderMap } from './room-order-map.input';

@ArgsType()
export class QueryRoomsArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => RoomOrderMap),
) {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Boolean, { nullable: true })
  isJoined?: boolean;
}
