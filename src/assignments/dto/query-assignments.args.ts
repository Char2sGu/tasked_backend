import { ArgsType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryAssignmentsArgs extends WithPagination {
  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
