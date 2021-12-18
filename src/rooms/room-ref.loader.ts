import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Room } from './entities/room.entity';

@Injectable()
export class RoomRefLoader extends EntityRefLoader<Room> {
  @InjectRepository(Room) protected repo: Repository<Room>;
}
