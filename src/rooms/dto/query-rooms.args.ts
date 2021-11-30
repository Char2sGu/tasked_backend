import { ArgsType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryRoomsArgs extends WithPagination {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Boolean, { nullable: true })
  isJoined?: boolean;
}
