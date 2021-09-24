import { InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Field } from 'src/common/field.decorator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';

@InputType()
export class TaskCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;
}
