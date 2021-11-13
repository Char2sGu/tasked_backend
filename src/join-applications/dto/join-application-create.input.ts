import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Field } from 'src/shared/field.decorator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class JoinApplicationCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
