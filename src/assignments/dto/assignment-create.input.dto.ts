import { ID, InputType } from '@nestjs/graphql';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => Membership, [CommonFilter.Crud])
  recipient: number;

  @Field(() => ID)
  @IsPrimaryKey(() => Task, [CommonFilter.Crud])
  task: number;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
