import { InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Field } from 'src/common/utilities/field.decorator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';

@InputType()
export class ClassroomCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 15)
  name: string;

  @Field(() => String, { nullable: true })
  @MaxLength(100)
  description?: string;
}
