import { InputType } from '@nestjs/graphql';
import { Length, Matches } from 'class-validator';
import { Existence } from 'src/shared/existence.decorator';
import { Field } from 'src/shared/field.decorator';
import { ValidationContextAttached } from 'src/shared/validation-context-attached.dto';
import { Gender } from 'src/users/entities/gender.enum';

import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@InputType()
export class UserCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Existence<User>(
    false,
    () => UsersService,
    (username: string) => ({ username }),
    { message: 'Cannot specify a duplicate username' },
  )
  @Matches(/^([a-zA-Z0-9_-])+$/)
  @Length(1, 15)
  username: string;

  @Field(() => String, { nullable: true })
  @Length(1, 15)
  nickname?: string;

  @Field(() => String)
  @Length(6, 20)
  password: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}
