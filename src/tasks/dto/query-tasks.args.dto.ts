import { ArgsType, Field, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';

import { TaskOrderMap } from './task-order-map.input.dto';

@ArgsType()
export class QueryTasksArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => TaskOrderMap),
) {
  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
