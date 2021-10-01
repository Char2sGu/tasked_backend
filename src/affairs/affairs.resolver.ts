import { ForbiddenException, Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ReqUser } from 'src/common/req-user.decorator';
import { ResolveField } from 'src/common/resolve-field.decorator';
import { User } from 'src/users/entities/user.entity';

import { AffairsService } from './affairs.service';
import { CreateAffairArgs } from './dto/create-affair.args';
import { DeleteAffairArgs } from './dto/delete-affair.args';
import { PaginatedAffairs } from './dto/paginated-affairs.dto';
import { QueryAffairArgs } from './dto/query-affair.args';
import { QueryAffairsArgs } from './dto/query-affairs.args';
import { UpdateAffairArgs } from './dto/update-affair.args';
import { Affair } from './entities/affair.entity';

@Resolver(() => Affair)
export class AffairsResolver {
  @Inject()
  service: AffairsService;

  @Inject()
  classroomsService: ClassroomsService;

  @Query(() => PaginatedAffairs, {
    name: 'affairs',
  })
  async queryMany(
    @ReqUser() user: User,
    @Args() { limit, offset }: QueryAffairsArgs,
  ) {
    return this.service.list(
      {},
      { limit, offset, filters: { visible: { user } } },
    );
  }

  @Query(() => Affair, {
    name: 'affair',
  })
  async queryOne(@ReqUser() user: User, @Args() { id }: QueryAffairArgs) {
    return this.service.retrieve(id, { filters: { visible: { user } } });
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'createAffair',
  })
  async createOne(@ReqUser() user: User, @Args() { data }: CreateAffairArgs) {
    const classroom = await this.classroomsService.retrieve(data.classroom, {
      filters: { visible: { user } },
    });

    if (user != classroom.creator)
      throw new ForbiddenException(
        'Cannot create affairs in classrooms not created by you',
      );

    return this.service.create({ ...data });
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'updateAffair',
  })
  async updateOne(
    @ReqUser() user: User,
    @Args() { id, data }: UpdateAffairArgs,
  ) {
    const affair = await this.service.retrieve(id, {
      filters: { visible: { user } },
      populate: ['classroom'],
    });

    if (user != affair.classroom.creator)
      throw new ForbiddenException(
        'Cannot update affairs of classrooms not created by you',
      );

    return this.service.update(affair, data);
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'deleteAffair',
  })
  async deleteOne(@ReqUser() user: User, @Args() { id }: DeleteAffairArgs) {
    const affair = await this.service.retrieve(id, {
      filters: { visible: { user } },
      populate: ['classroom'],
    });

    if (affair)
      throw new ForbiddenException(
        'Cannot delete affairs of classrooms not created by you',
      );

    return this.service.destroy(affair);
  }

  @ResolveField(() => Affair, 'classroom')
  async resolveClassroom(@Parent() entity: Affair) {
    return entity.classroom.init();
  }
}
