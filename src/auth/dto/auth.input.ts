import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
