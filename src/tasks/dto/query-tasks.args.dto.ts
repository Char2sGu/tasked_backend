import { ArgsType, Field } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';

@ArgsType()
export class QueryTasksArgs extends WithPagination {
  @Field(() => Boolean, { nullable: true })
  isOwn?: boolean;
}
