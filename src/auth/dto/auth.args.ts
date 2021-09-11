import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class AuthArgs {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
