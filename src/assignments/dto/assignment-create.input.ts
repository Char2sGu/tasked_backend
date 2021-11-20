import { ID, InputType } from '@nestjs/graphql';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => User, [CommonFilter.Crud])
  recipient: number;

  @Field(() => ID)
  @IsPrimaryKey(() => Task, [CommonFilter.Crud])
  task: number;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
