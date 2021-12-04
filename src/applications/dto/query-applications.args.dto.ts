import { ArgsType, IntersectionType } from '@nestjs/graphql';
import { WithOrder } from 'src/common/dto/order/with-order.args';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

import { ApplicationOrderMap } from './application-order-map.input';

@ArgsType()
export class QueryApplicationsArgs extends IntersectionType(
  WithPagination,
  WithOrder.for(() => ApplicationOrderMap),
) {
  @Field(() => Boolean, { nullable: true })
  isPending?: boolean;
}
