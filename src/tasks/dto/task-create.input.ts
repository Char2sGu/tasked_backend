import { InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Field } from 'src/shared/field.decorator';

@InputType()
export class TaskCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;
}
