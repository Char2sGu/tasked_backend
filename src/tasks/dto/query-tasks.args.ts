import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@ArgsType()
export class QueryTasksArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
