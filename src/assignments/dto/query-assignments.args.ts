import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Field } from 'src/shared/field.decorator';

@ArgsType()
export class QueryAssignmentsArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
