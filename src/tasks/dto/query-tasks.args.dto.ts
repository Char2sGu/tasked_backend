import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithFilter } from 'src/common/dto/filter/with-filter.args.dto';
import { WithOrder } from 'src/common/dto/order/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { TaskFilterMap } from './task-filter-map.input.dto';
import { TaskOrderMap } from './task-order-map.input.dto';

@ArgsType()
export class QueryTasksArgs extends IntersectionType(
  WithPagination,
  IntersectionType(
    WithOrder.for(() => TaskOrderMap),
    WithFilter.for(() => TaskFilterMap),
  ),
) {
  @Field(() => Boolean, { nullable: true })
  ownOnly?: boolean;
}
