import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseAccessPolicies } from 'nest-access-policy';
import { AccessPolicyGuard } from 'src/common/access-policy/access-policy.guard';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { User } from 'src/users/entities/user.entity';

import { ClassroomsAccessPolicy } from './classrooms.access-policy';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomArgs } from './dto/create-classroom.args';
import { DeleteClassroomArgs } from './dto/delete-classroom.args';
import { PaginatedClassrooms } from './dto/paginated-classrooms.dto';
import { QueryClassroomArgs } from './dto/query-classroom.args';
import { QueryClassroomsArgs } from './dto/query-classrooms.args';
import { UpdateClassroomArgs } from './dto/update-classroom.args';
import { Classroom } from './entities/classroom.entity';

@UseAccessPolicies(ClassroomsAccessPolicy)
@UseGuards(AccessPolicyGuard)
@Resolver(() => Classroom)
export class ClassroomsResolver {
  @Inject()
  service: ClassroomsService;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

  @Query(() => PaginatedClassrooms, { name: 'classrooms' })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryClassroomsArgs,
  ) {
    return this.service.list(
      {},
      {
        limit,
        offset,
        filters: this.filters(user),
        orderBy: { id: 'ASC' }, // the order will be messy for some unknown reasons when the filters are enabled
      },
    );
  }

  @Query(() => Classroom, { name: 'classroom' })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryClassroomArgs) {
    return this.service.retrieve(id, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Classroom, { name: 'createClassroom' })
  async createOne(@Args() { data }: CreateClassroomArgs) {
    return this.service.create(data);
  }

  @FlushDb()
  @Mutation(() => Classroom, { name: 'updateClassroom' })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateClassroomArgs,
  ) {
    return this.service.update(id, data, { filters: this.filters(user) });
  }

  @FlushDb()
  @Mutation(() => Classroom, { name: 'deleteClassroom' })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteClassroomArgs) {
    return this.service.destroy(id, { filters: this.filters(user) });
  }
}
