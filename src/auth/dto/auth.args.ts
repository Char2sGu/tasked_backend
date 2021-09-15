import { ArgsType, Field } from '@nestjs/graphql';
import { Allow } from 'class-validator';

@ArgsType()
export class AuthArgs {
  @Field(() => String)
  @Allow()
  username: string;

  @Field(() => String)
  @Allow()
  password: string;
}
