import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/utilities/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { AcceptJoinApplicationArgs } from './dto/accept-join-application.args';
import { AcceptJoinApplicationResult } from './dto/accept-join-application-result.dto';
import { CreateJoinApplicationArgs } from './dto/create-join-application.args';
import { PaginatedJoinApplications } from './dto/paginated-join-applications.dto';
import { QueryJoinApplicationArgs } from './dto/query-join-application.args';
import { QueryJoinApplicationsArgs } from './dto/query-join-applications.args';
import { RejectJoinApplicationArgs } from './dto/reject-join-application.args';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsService } from './join-applications.service';

@Resolver(() => JoinApplication)
export class JoinApplicationsResolver {
  @Inject()
  private service: JoinApplicationsService;

  @Query(() => PaginatedJoinApplications, {
    name: 'joinApplications',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() args: QueryJoinApplicationsArgs,
  ) {
    return this.service.queryMany(user, args);
  }

  @Query(() => JoinApplication, {
    name: 'joinApplication',
  })
  async queryOne(
    @ReqUser() user: User,
    @Args() args: QueryJoinApplicationArgs,
  ) {
    return this.service.queryOne(user, args);
  }

  @FlushDb()
  @Mutation(() => JoinApplication, {
    name: 'createJoinApplication',
  })
  async createOne(
    @ReqUser() user: User,
    @Args() args: CreateJoinApplicationArgs,
  ) {
    return this.service.createOne(user, args);
  }

  @FlushDb()
  @Mutation(() => JoinApplication, {
    name: 'rejectJoinApplication',
  })
  async rejectOne(
    @ReqUser() user: User,
    @Args() args: RejectJoinApplicationArgs,
  ) {
    return this.service.rejectOne(user, args);
  }

  @FlushDb()
  @Mutation(() => AcceptJoinApplicationResult, {
    name: 'acceptJoinApplication',
  })
  async acceptOne(
    @ReqUser() user: User,
    @Args() args: AcceptJoinApplicationArgs,
  ) {
    return this.service.acceptOne(user, args);
  }

  @ResolveField(() => JoinApplication, 'owner', () => User)
  async resolveOwner(@Parent() entity: JoinApplication) {
    return entity.owner.init();
  }

  @ResolveField(() => JoinApplication, 'classroom', () => Classroom)
  async resolveClassroom(@Parent() entity: JoinApplication) {
    return entity.classroom.init();
  }
}
