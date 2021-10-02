import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { AffairsService } from 'src/affairs/affairs.service';
import { QueryAffairsArgs } from 'src/affairs/dto/query-affairs.args';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { QueryJoinApplicationsArgs } from 'src/join-applications/dto/query-join-applications.args';
import { JoinApplicationsService } from 'src/join-applications/join-applications.service';
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
  private readonly service: ClassroomsService;

  @Inject()
  private readonly joinApplicationsService: JoinApplicationsService;

  @Inject()
  private readonly membershipsService: MembershipsService;

  @Inject()
  private readonly affairsService: AffairsService;

  @Query(() => PaginatedClassrooms, {
    name: 'classrooms',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryClassroomsArgs,
  ) {
    return this.service.list(
      {},
      {
        limit,
        offset,
        filters: { visible: { user } },
        orderBy: { id: 'ASC' }, // the order will be messy for some unknown reasons when the filters are enabled
      },
    );
  }

  @Query(() => Classroom, {
    name: 'classroom',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryClassroomArgs) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'createClassroom',
  })
  async createOne(
    @ReqUser() user: User,
    @Args() { data }: CreateClassroomArgs,
  ) {
    const QUOTA = 20;
    const createdCount = await this.service.count({ creator: user });
    if (createdCount >= QUOTA)
      throw new ForbiddenException(
        `Cannot create more than ${QUOTA} classrooms`,
      );

    return this.service.create({ ...data, creator: user });
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'updateClassroom',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateClassroomArgs,
  ) {
    const classroom = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot update classrooms not created by you',
      );

    return this.service.update(classroom, data);
  }

  @FlushDb()
  @Mutation(() => Classroom, {
    name: 'deleteClassroom',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteClassroomArgs) {
    const classroom = await this.service.retrieve(id, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot delete classrooms not created by you',
      );

    return this.service.destroy(classroom);
  }

  @ResolveField(() => Classroom, 'joinApplications')
  async resolveJoinApplications(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset }: QueryJoinApplicationsArgs,
  ) {
    return this.joinApplicationsService.list(
      { classroom: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => Classroom, 'memberships')
  async resolveMemberships(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset }: QueryMembershipsArgs,
  ) {
    return this.membershipsService.list(
      { classroom: entity },
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @ResolveField(() => Classroom, 'affairs')
  async resolveAffairs(
    @ReqUser() user: User,
    @Parent() entity: Classroom,
    @Args() { limit, offset, isActivated }: QueryAffairsArgs,
  ) {
    return this.affairsService.list(
      {
        classroom: entity,
        ...(isActivated != undefined ? { isActivated } : null),
      },
      { limit, offset, filters: { visible: { user } } },
    );
  }
}
