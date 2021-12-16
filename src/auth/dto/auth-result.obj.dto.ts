import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class AuthResult {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
