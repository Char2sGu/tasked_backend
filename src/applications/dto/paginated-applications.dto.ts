import { ObjectType } from '@nestjs/graphql';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

import { Application } from '../entities/application.entity';

@ObjectType()
export class PaginatedApplications extends PaginatedDto.for(
  () => Application,
) {}
