import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateRoomArgs } from './dto/create-room.args';
import { DeleteRoomArgs } from './dto/delete-room.args';
import { PaginatedRooms } from './dto/paginated-rooms.dto';
import { QueryRoomArgs } from './dto/query-room.args';
import { QueryRoomsArgs } from './dto/query-rooms.args';
import { UpdateRoomArgs } from './dto/update-room.args';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private service: RoomsService) {}

  @Query(() => PaginatedRooms)
  async rooms(@Args() args: QueryRoomsArgs) {
    return this.service.queryMany(args);
  }

  @Query(() => Room)
  async room(@Args() args: QueryRoomArgs) {
    return this.service.queryOne(args);
  }

  @Mutation(() => Room)
  async createRoom(@Args() args: CreateRoomArgs) {
    return this.service.createOne(args);
  }

  @Mutation(() => Room)
  async updateRoom(@Args() args: UpdateRoomArgs) {
    return this.service.updateOne(args);
  }

  @Mutation(() => Room)
  async deleteRoom(@Args() args: DeleteRoomArgs) {
    return this.service.deleteOne(args);
  }
}
