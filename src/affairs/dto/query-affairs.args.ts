import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@ArgsType()
export class QueryAffairsArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isActivated?: boolean;
}
