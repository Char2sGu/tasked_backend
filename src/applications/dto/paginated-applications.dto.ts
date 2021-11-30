import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/common/dto/paginated.dto';

import { Application } from '../entities/application.entity';

@ObjectType()
export class PaginatedApplications extends Paginated.for(() => Application) {}
