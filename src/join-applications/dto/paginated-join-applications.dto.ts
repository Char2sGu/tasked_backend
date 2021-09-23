import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { JoinApplication } from '../entities/join-application.entity';

@ObjectType()
export class PaginatedJoinApplications extends PaginatedDto.for(
  JoinApplication,
) {}
