import { ID, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Field } from 'src/shared/field.decorator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class TaskCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;

  @Field(() => ID)
  classroom: number;
}
