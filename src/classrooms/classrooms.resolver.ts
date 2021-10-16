import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AffairsService } from 'src/affairs/affairs.service';
import { PaginatedAffairs } from 'src/affairs/dto/paginated-affairs.dto';
import { QueryAffairsArgs } from 'src/affairs/dto/query-affairs.args';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { QueryAssignmentsArgs } from 'src/assignments/dto/query-assignments.args';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { JoinApplicationsService } from 'src/join-applications/join-applications.service';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { QueryMembershipsArgs } from 'src/memberships/dto/query-memberships.args';
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
  private affairs: AffairsService;

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
  resolveCreator(@Parent() entity: Classroom) {
    return entity.creator.init();
  }

  @ResolveField(
    () => Classroom,
    'joinApplications',
    () => PaginatedJoinApplications,
  )
  async resolveJoinApplications(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.joinApplications.list(
      { classroom: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => Classroom, 'memberships', () => PaginatedMemberships)
  async resolveMemberships(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.memberships.list(
      { classroom: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => Classroom, 'affairs', () => PaginatedAffairs)
  async resolveAffairs(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset, isActivated }: QueryAffairsArgs,
  ) {
    return this.affairs.list(
      {
        classroom: entity,
        ...(isActivated != undefined ? { isActivated } : null),
      },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => Classroom, 'assignments', () => PaginatedAssignments)
  async resolveAssignments(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset }: QueryAssignmentsArgs,
  ) {
    return this.assignments.list(
      { classroom: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }
}
