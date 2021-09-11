import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { BodyContextAttached } from 'src/body-context-attached.dto';
import { Existence } from 'src/existence.decorator';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Role } from 'src/memberships/role.enum';
import { User } from 'src/users/entities/user.entity';

import { ApplicationStatus } from '../application-status.enum';
import { JoinApplication } from '../entities/join-application.entity';
import { JoinApplicationsService } from '../join-applications.service';

@InputType()
export class JoinApplicationCreateInput extends BodyContextAttached {
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
  classroom: number;

  @Field(() => Role)
  role: Role;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(50)
  message?: string;
}
