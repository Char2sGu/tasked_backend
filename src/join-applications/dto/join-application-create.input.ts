import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/field.decorator';
import { FilterName } from 'src/common/filter-name.enum';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class JoinApplicationCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => Classroom, [FilterName.CRUD])
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
