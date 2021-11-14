import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common/req-user.decorator';
import { FlushDbRequired } from 'src/core/flush-db-required.decorator';
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
  constructor(private service: JoinApplicationsService) {}

  @Query(() => PaginatedJoinApplications)
  async joinApplications(
    @Args() args: QueryJoinApplicationsArgs,
    @ReqUser() user: User,
  ) {
    return this.service.queryMany(user, args);
  }

  @Query(() => JoinApplication)
  async joinApplication(
    @Args() args: QueryJoinApplicationArgs,
    @ReqUser() user: User,
  ) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => JoinApplication)
  async createJoinApplication(
    @Args() args: CreateJoinApplicationArgs,
    @ReqUser() user: User,
  ) {
    return this.service.createOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => JoinApplication)
  async rejectJoinApplication(
    @Args() args: RejectJoinApplicationArgs,
    @ReqUser() user: User,
  ) {
    return this.service.rejectOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => AcceptJoinApplicationResult)
  async acceptJoinApplication(
    @Args() args: AcceptJoinApplicationArgs,
    @ReqUser() user: User,
  ) {
    return this.service.acceptOne(user, args);
  }
}
