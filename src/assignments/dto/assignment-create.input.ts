import { ID, InputType } from '@nestjs/graphql';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Role } from 'src/memberships/entities/role.enum';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Field } from 'src/shared/field.decorator';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Existence } from 'src/validation/existence.decorator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

@InputType()
export class AssignmentCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  @Existence<Membership>(
    true,
    () => MembershipsService,
    (userId: number) => ({ owner: userId, role: Role.Student }),
    {
      message:
        'recipient must be the ID of a user having a student membership in this classroom',
    },
  )
  recipient: number;

  @Field(() => ID)
  @Existence<Task>(
    true,
    () => TasksService,
    (taskId: number, user) => ({
      id: taskId,
      creator: user,
    }),
    {
      message: 'task must be the ID of a task which is created by you',
    },
  )
  task: number;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
