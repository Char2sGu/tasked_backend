import { ArgsType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryTokenArgs {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
