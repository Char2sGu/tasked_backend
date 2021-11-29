import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Room } from '../entities/room.entity';

@ObjectType()
export class PaginatedRooms extends PaginatedDto.for(() => Room) {}
