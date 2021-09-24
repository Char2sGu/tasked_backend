import { InputType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Field } from 'src/common/field.decorator';

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
  @Length(1, 200)
  remark?: string;

  @Field(() => Boolean, { nullable: true })
  isActivated?: boolean;
}
