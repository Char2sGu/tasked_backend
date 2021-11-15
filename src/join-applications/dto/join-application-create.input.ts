import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/field.decorator';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class JoinApplicationCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => Classroom, [CRUD_FILTER])
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
