import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Membership } from './entities/membership.entity';
import { MembershipsService } from './memberships.service';

@UseGuards(JwtAuthGuard)
@Controller()
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
