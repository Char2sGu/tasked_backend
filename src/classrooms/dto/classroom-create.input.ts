import { InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Field } from 'src/shared/field.decorator';

@InputType()
export class ClassroomCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 15)
  name: string;

  @Field(() => String, { nullable: true })
  @MaxLength(100)
  description?: string;
}
