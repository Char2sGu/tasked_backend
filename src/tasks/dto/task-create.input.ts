import { InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class TaskCreateInput {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
