import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/utilities/resolve-field.decorator';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { JoinApplicationsService } from 'src/join-applications/join-applications.service';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { User } from 'src/users/entities/user.entity';

import { ClassroomsService } from './classrooms.service';
import { CreateClassroomArgs } from './dto/create-classroom.args';
import { DeleteClassroomArgs } from './dto/delete-classroom.args';
import { PaginatedClassrooms } from './dto/paginated-classrooms.dto';
import { QueryClassroomArgs } from './dto/query-classroom.args';
import { QueryClassroomsArgs } from './dto/query-classrooms.args';
import { UpdateClassroomArgs } from './dto/update-classroom.args';
import { Classroom } from './entities/classroom.entity';

@Resolver(() => Classroom)
export class ClassroomsResolver {
  @Inject()
  private service: ClassroomsService;

  @Inject()
  private joinApplications: JoinApplicationsService;

  @Inject()
  private memberships: MembershipsService;

  @Inject()
  private assignments: AssignmentsService;

  @Query(() => PaginatedClassrooms, {
    name: 'classrooms',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryClassroomsArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Classroom, {
    name: 'classroom',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryClassroomArgs) {
    return this.service.queryOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'createClassroom',
  })
  async createOne(@ReqUser() user: User, @Args() args: CreateClassroomArgs) {
    return this.service.createOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'updateClassroom',
  })
  async updateOne(@ReqUser() user: User, @Args() args: UpdateClassroomArgs) {
    return this.service.updateOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'deleteClassroom',
  })
  async deleteOne(@ReqUser() user: User, @Args() args: DeleteClassroomArgs) {
    return this.service.deleteOne(user, args);
  }

  @ResolveField(() => Classroom, 'creator', () => User)
  async resolveCreator(@Parent() entity: Classroom) {
    return entity.creator.init();
  }

  @ResolveField(() => Classroom, 'membership', () => Membership, {
    nullable: true,
  })
  async resolveMembership(@ReqUser() user: User, @Parent() entity: Classroom) {
    return entity.memberships
      .matching({ where: { owner: user }, limit: 1 })
      .then(([v]) => v);
  }

  @ResolveField(
    () => Classroom,
    'joinApplications',
    () => PaginatedJoinApplications,
  )
  async resolveJoinApplications(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() args: QueryJoinApplicationsArgs,
  ) {
    return this.joinApplications.queryMany(user, args, { classroom: entity });
  }

  @ResolveField(() => Classroom, 'memberships', () => PaginatedMemberships)
  async resolveMemberships(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() args: QueryMembershipsArgs,
  ) {
    return this.memberships.queryMany(user, args, { classroom: entity });
  }

  @ResolveField(() => Classroom, 'assignments', () => PaginatedAssignments)
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() args: QueryAssignmentsArgs,
  ) {
    return this.assignments.queryMany(user, args, { classroom: entity });
  }
}
