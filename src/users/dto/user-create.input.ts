import { InputType } from '@nestjs/graphql';
import { Length, Matches } from 'class-validator';
import { Field } from 'src/shared/field.decorator';
import { Gender } from 'src/users/entities/gender.enum';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class UserCreateInput extends ValidationContextAttached {
  @Field(() => String)
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
