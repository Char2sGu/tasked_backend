import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  async joinApplications(@Args() args: QueryJoinApplicationsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => JoinApplication)
  async joinApplication(@Args() args: QueryJoinApplicationArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => JoinApplication)
  async createJoinApplication(@Args() args: CreateJoinApplicationArgs) {
    return this.service.createOne(args);
  }

  @Mutation(() => JoinApplication)
  async rejectJoinApplication(@Args() args: RejectJoinApplicationArgs) {
    return this.service.rejectOne(args);
  }

  @Mutation(() => AcceptJoinApplicationResult)
  async acceptJoinApplication(@Args() args: AcceptJoinApplicationArgs) {
    return this.service.acceptOne(args);
  }
}
