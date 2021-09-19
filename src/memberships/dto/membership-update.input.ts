import { InputType } from '@nestjs/graphql';
import { IsOptional, Length, NotContains } from 'class-validator';
import { Field } from 'src/common/field.decorator';

@InputType()
export class MembershipUpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @NotContains(' ')
  @Length(1, 15)
  displayName?: string;
}
