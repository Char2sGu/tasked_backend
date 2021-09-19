import { Field, InputType } from '@nestjs/graphql';
import { Allow, IsOptional, Length, Matches } from 'class-validator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Existence } from 'src/common/validation/existence.decorator';
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
  @IsOptional()
  nickname?: string;

  @Field(() => String)
  @Length(6, 20)
  password: string;

  @Field(() => Gender, { nullable: true })
  @Allow()
  gender?: Gender;
}
