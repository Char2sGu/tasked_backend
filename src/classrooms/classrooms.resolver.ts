import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  async classrooms(@Args() args: QueryClassroomsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Classroom)
  async classroom(@Args() args: QueryClassroomArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Classroom)
  async createClassroom(@Args() args: CreateClassroomArgs) {
    return this.service.createOne(args);
  }

  @Mutation(() => Classroom)
  async updateClassroom(@Args() args: UpdateClassroomArgs) {
    return this.service.updateOne(args);
  }

  @Mutation(() => Classroom)
  async deleteClassroom(@Args() args: DeleteClassroomArgs) {
    return this.service.deleteOne(args);
  }
}
