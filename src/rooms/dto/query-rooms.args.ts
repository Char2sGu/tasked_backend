import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryRoomsArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Boolean, { nullable: true })
  isJoined?: boolean;
}
