import { ID, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/field.decorator';
import { CRUD_FILTER } from 'src/mikro-filters/mikro-filters.constants';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class TaskCreateInput {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;

  @Field(() => ID)
  @IsPrimaryKey(() => Classroom, [CRUD_FILTER])
  classroom: number;
}
