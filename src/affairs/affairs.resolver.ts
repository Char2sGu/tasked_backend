import { Inject } from '@nestjs/common';
import { Args, Mutation, Parent, Query, Resolver } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { FlushDb } from 'src/common/flush-db/flush-db.decorator';
import { ResolveField } from 'src/common/utilities/resolve-field.decorator';
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
  private service: AffairsService;

  @Query(() => PaginatedAffairs, {
    name: 'affairs',
  })
  async queryMany(@ReqUser() user: User, @Args() args: QueryAffairsArgs) {
    return this.service.queryMany(user, args);
  }

  @Query(() => Affair, {
    name: 'affair',
  })
  async queryOne(@ReqUser() user: User, @Args() args: QueryAffairArgs) {
    return this.service.queryOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'createAffair',
  })
  async createOne(@ReqUser() user: User, @Args() args: CreateAffairArgs) {
    return this.service.createOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'updateAffair',
  })
  async updateOne(@ReqUser() user: User, @Args() args: UpdateAffairArgs) {
    return this.service.updateOne(user, args);
  }

  @FlushDb()
  @Mutation(() => Affair, {
    name: 'deleteAffair',
  })
  async deleteOne(@ReqUser() user: User, @Args() args: DeleteAffairArgs) {
    return this.service.deleteOne(user, args);
  }

  @ResolveField(() => Affair, 'classroom', () => Classroom)
  async resolveClassroom(@Parent() entity: Affair) {
    return entity.classroom.init();
  }
}
