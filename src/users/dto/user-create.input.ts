import { Field, InputType } from '@nestjs/graphql';
import { Length, Matches } from 'class-validator';
import { BodyContextAttached } from 'src/common/body-context-attached.dto';
import { Existence } from 'src/common/existence.decorator';
import { Gender } from 'src/users/gender.enum';

import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@InputType()
export class UserCreateInput extends BodyContextAttached {
  @Field(() => String)
  @Existence<User>(
    false,
    () => UsersService,
    (username: string) => ({ username }),
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
