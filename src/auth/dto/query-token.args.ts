import { ArgsType } from '@nestjs/graphql';
import { Allow } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class QueryTokenArgs {
  @Field(() => String)
  @Allow()
  username: string;

  @Field(() => String)
  @Allow()
  password: string;
}
