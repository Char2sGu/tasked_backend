import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/shared/field.decorator';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class JoinApplicationCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  @IsPrimaryKey(() => Classroom)
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
