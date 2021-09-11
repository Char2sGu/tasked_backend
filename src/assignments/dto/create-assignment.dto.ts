import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Validate } from 'class-validator';
import { BodyContextAttached } from 'src/body-context-attached.dto';
import { Existence } from 'src/existence.decorator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';

import { IsInferiorMemberConstraint } from './is-inferior-member.constraint';

export class CreateAssignmentDto extends BodyContextAttached {
  @Type()
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
  @IsInt()
  classroom: number;

  @Type()
  @Validate(IsInferiorMemberConstraint, {
    message:
      'owner must be the ID of a user which is an inferior member in the clasroom',
  })
  @IsInt()
  recipient: number;

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
  @Type()
  @IsInt()
  task: number;

  @Type()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
