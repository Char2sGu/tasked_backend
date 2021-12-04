import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Context } from 'src/context/context.class';
import { Role } from 'src/memberships/entities/role.enum';
import { MikroQuotaService } from 'src/mikro/mikro-quota/mikro-quota.service';
import { Repository } from 'src/mikro/repository.class';

import { CreateRoomArgs } from './dto/create-room.args.dto';
import { DeleteRoomArgs } from './dto/delete-room.args.dto';
import { QueryRoomArgs } from './dto/query-room.args.dto';
import { QueryRoomsArgs } from './dto/query-rooms.args.dto';
import { UpdateRoomArgs } from './dto/update-room.args.dto';
import { Room } from './entities/room.entity';
import { RoomFilter } from './room-filter.enum';

@Injectable()
export class RoomsService {
  constructor(
    private em: EntityManager,
    @InjectRepository(Room) private repo: Repository<Room>,
    private quota: MikroQuotaService,
  ) {}

  async queryMany(
    { limit, offset, order, isOpen, isJoined }: QueryRoomsArgs,
    query: FilterQuery<Room> = {},
  ) {
    return this.repo.findAndPaginate(query, {
      limit,
      offset,
      filters: {
        [CommonFilter.Crud]: true,
        [RoomFilter.IsJoined]: isJoined,
        [RoomFilter.IsOpen]: { value: isOpen },
      },
      orderBy: { ...order },
    });
  }

  async queryOne({ id }: QueryRoomArgs) {
    return this.repo.findOneOrFail(id, { filters: [CommonFilter.Crud] });
  }

  async createOne({ data }: CreateRoomArgs) {
    const user = Context.current.user;
    await this.em.populate(user, ['rooms']);
    await this.quota.check(user, 'rooms');
    return this.repo.create({
      creator: user,
      memberships: [{ owner: user, role: Role.Manager }],
      isOpen: true,
      ...data,
    });
  }

  async updateOne({ id, data }: UpdateRoomArgs) {
    const room = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    const user = Context.current.user;
    if (user != room.creator)
      throw new ForbiddenException('Cannot update rooms not created by you');

    return room.assign(data);
  }

  async deleteOne({ id }: DeleteRoomArgs) {
    const room = await this.repo.findOneOrFail(id, {
      filters: [CommonFilter.Crud],
    });

    const user = Context.current.user;
    if (user != room.creator)
      throw new ForbiddenException('Cannot delete rooms not created by you');

    await this.repo.populate(room, [
      'applications',
      'memberships',
      'tasks',
      'tasks.assignments',
    ]);

    return this.repo.delete(room);
  }
}
