import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/order/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { AssignmentOrderMap } from './assignment-order-map.input.dto';

@ArgsType()
export class QueryAssignmentsArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => AssignmentOrderMap),
) {
  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
