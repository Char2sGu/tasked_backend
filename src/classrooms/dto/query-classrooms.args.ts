import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Field } from 'src/common/utilities/field.decorator';

@ArgsType()
export class QueryClassroomsArgs extends PaginationArgs {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean;

  @Field(() => Boolean, { nullable: true })
  isJoined?: boolean;
}
