import { ID, InputType } from '@nestjs/graphql';
import { Field } from 'src/shared/field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => User)
  recipient: number;

  @Field(() => ID)
  @IsPrimaryKey(() => Task)
  task: number;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
