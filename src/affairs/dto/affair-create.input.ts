import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class AffairCreateInput {
  @Field(() => Int)
  classroom: number;

  @Field(() => String)
  @Length(1, 50)
  title: string;

  @Field(() => Date)
  timeStart: Date;

  @Field(() => Date)
  timeEnd: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 200)
  remark?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActivated?: boolean;
}
