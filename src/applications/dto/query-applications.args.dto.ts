import { ArgsType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryApplicationsArgs extends WithPagination {
  @Field(() => Boolean, { nullable: true })
  isPending?: boolean;
}
