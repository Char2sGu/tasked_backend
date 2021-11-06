import { ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/utilities/field.decorator';
import { Existence } from 'src/common/validation/existence.decorator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from '../entities/application-status.enum';
import { JoinApplication } from '../entities/join-application.entity';
import { JoinApplicationsService } from '../join-applications.service';

@InputType()
export class JoinApplicationCreateInput extends ValidationContextAttached {
  @Field(() => ID)
  @Existence<JoinApplication>(
    false,
    () => JoinApplicationsService,
    (classroomId: number, user) => ({
      owner: user,
      classroom: classroomId,
      status: ApplicationStatus.Pending,
    }),
    {
      message: 'classroom must not have a pending application sent by you',
    },
  )
  @Existence<Membership>(
    false,
    () => MembershipsService,
    (classroomId: number, user: User) => ({
      owner: user,
      classroom: classroomId,
    }),
    {
      message: 'classroom must not have a membership of you',
    },
  )
  @Existence<Classroom>(true, () => ClassroomsService, (id: number) => id, {
    message: 'classroom not found',
  })
  classroom: number;

  @Field(() => String, { nullable: true })
  @MaxLength(20)
  message?: string;
}
