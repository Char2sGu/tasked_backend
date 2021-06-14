import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Membership } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

export const PREFIX = `${ROOT_PREFIX}/memberships`;

@UseGuards(JwtAuthGuard)
@Controller(PREFIX)
export class MembershipsController extends new MikroCrudControllerFactory<MembershipsService>(
  {
    serviceClass: MembershipsService,
    actions: ['list', 'retrieve', 'destroy'],
    lookup: { field: 'id', name: 'id' },
    queryDtoClass: new QueryDtoFactory<Membership>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
  },
).product {}
