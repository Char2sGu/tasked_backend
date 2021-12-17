import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Room } from './entities/room.entity';

@Injectable()
export class RoomRefLoader extends RefLoader<Room> {
  constructor(@InjectRepository(Room) protected repo: Repository<Room>) {
    super();
  }
}
