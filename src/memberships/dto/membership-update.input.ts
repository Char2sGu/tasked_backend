import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, NotContains } from 'class-validator';

@InputType()
export class MembershipUpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @NotContains(' ')
  @Length(1, 15)
  displayName?: string;
}
