import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryApplicationsArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isPending?: boolean;
}