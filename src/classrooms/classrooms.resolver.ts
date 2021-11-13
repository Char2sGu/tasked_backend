import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReqUser } from 'src/common/req-user.decorator';
import { FlushDbRequired } from 'src/shared/flush-db-required.decorator';
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
  constructor(private service: ClassroomsService) {}

  @Query(() => PaginatedClassrooms)
  async classrooms(@Args() args: QueryClassroomsArgs, @ReqUser() user: User) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Classroom)
  async classroom(@Args() args: QueryClassroomArgs, @ReqUser() user: User) {
    return this.service.queryOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Classroom)
  async createClassroom(
    @Args() args: CreateClassroomArgs,
    @ReqUser() user: User,
  ) {
    return this.service.createOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Classroom)
  async updateClassroom(
    @Args() args: UpdateClassroomArgs,
    @ReqUser() user: User,
  ) {
    return this.service.updateOne(user, args);
  }

  @FlushDbRequired()
  @Mutation(() => Classroom)
  async deleteClassroom(
    @Args() args: DeleteClassroomArgs,
    @ReqUser() user: User,
  ) {
    return this.service.deleteOne(user, args);
  }
}
