import { Field, ID, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, Validate } from 'class-validator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Existence } from 'src/common/validation/existence.decorator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';

import { IsInferiorMemberConstraint } from './is-inferior-member.constraint';

@InputType()
export class AssignmentCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  @Existence<Membership>(
    true,
    () => MembershipsService,
    (classroomId: number, user) => ({
      owner: user,
      classroom: classroomId,
    }),
    {
      message: 'classroom must the ID of a classroom having your membership',
    },
  )
  classroom: number;

  @Field(() => ID)
  @Validate(IsInferiorMemberConstraint, {
    message:
      'owner must be the ID of a user which is an inferior member in the clasroom',
  })
  @IsInt()
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
  @IsOptional()
  isPublic?: boolean;
}
