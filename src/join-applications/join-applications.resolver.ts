import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { AcceptJoinApplicationArgs } from './dto/accept-join-application.args';
import { AcceptJoinApplicationResult } from './dto/accept-join-application-result.dto';
import { CreateJoinApplicationArgs } from './dto/create-join-application.args';
import { PaginatedJoinApplications } from './dto/paginated-join-applications.dto';
import { QueryJoinApplicationArgs } from './dto/query-join-application.args';
import { QueryJoinApplicationsArgs } from './dto/query-join-applications.args';
import { RejectJoinApplicationArgs } from './dto/reject-join-application.args';
import { UpdateJoinApplicationArgs } from './dto/update-join-application.args';
import { ApplicationStatus } from './entities/application-status.enum';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsService } from './join-applications.service';

@Resolver(() => JoinApplication)
export class JoinApplicationsResolver {
  @Inject()
  private readonly service: JoinApplicationsService;

  @Inject()
  private readonly membershipsService: MembershipsService;

  @Query(() => PaginatedJoinApplications, {
    name: 'joinApplications',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @Query(() => JoinApplication, {
    name: 'joinApplication',
  })
  async queryOne(
    @ReqUser() user: User,
    @Args() { id }: QueryJoinApplicationArgs,
  ) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
  }

  @FlushDb()
  @Mutation(() => JoinApplication, {
    name: 'createJoinApplication',
  })
  async createOne(
    @ReqUser() user: User,
    @Args() { data }: CreateJoinApplicationArgs,
  ) {
    return this.service.create({ ...data, owner: user });
  }

  @FlushDb()
  @Mutation(() => JoinApplication, {
    name: 'updateJoinApplication',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateJoinApplicationArgs,
  ) {
    const application = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.owner != user)
      throw new ForbiddenException(
        'Cannot update applications created by others',
      );
    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot update resulted applications');

    return this.service.update(application, data);
  }

  @FlushDb()
  @Mutation(() => JoinApplication, {
    name: 'rejectJoinApplication',
  })
  async rejectOne(
    @ReqUser() user: User,
    @Args() { id }: RejectJoinApplicationArgs,
  ) {
    const application = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot reject resulted applications');

    return this.service.update(application, {
      status: ApplicationStatus.Rejected,
    });
  }

  @FlushDb()
  @Mutation(() => AcceptJoinApplicationResult, {
    name: 'acceptJoinApplication',
  })
  async acceptOne(
    @ReqUser() user: User,
    @Args() { id }: AcceptJoinApplicationArgs,
  ) {
    const application = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (application.status != ApplicationStatus.Pending)
      throw new ForbiddenException('Cannot accept resulted applications');

    await this.service.update(application, {
      status: ApplicationStatus.Accepted,
    });

    const membership = await this.membershipsService.create({
      owner: user,
      classroom: application.classroom,
      role: application.role,
    });

    return { application, membership };
  }

  @ResolveField(() => JoinApplication, 'owner', () => User)
  resolveOwner(@Parent() entity: JoinApplication) {
    return entity.owner.init();
  }

  @ResolveField(() => JoinApplication, 'classroom', () => Classroom)
  resolveClassroom(@Parent() entity: JoinApplication) {
    return entity.classroom.init();
  }
}
