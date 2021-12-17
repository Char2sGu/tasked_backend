import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Context } from 'src/context/context.class';
import { DataLoader } from 'src/data-loader/data-loader.class';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Repository } from 'src/mikro/repository.class';

import { Room } from './entities/room.entity';

/**
 * Load the user's own memberships in the rooms.
 */
@Injectable()
export class RoomMembershipLoader extends DataLoader<
  Room,
  Membership | undefined
> {
  constructor(
    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,
  ) {
    super();
  }

  protected async resolve(rooms: Room[]) {
    const memberships = await this.membershipRepo.find({
      owner: Context.current.user,
      room: { $in: rooms },
    });
    return rooms.map((room) =>
      memberships.find((membership) => membership.room == room),
    );
  }
}
