import { Controller, UseGuards } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Membership } from './entities/membership.entity';
import { MembershipsAccessPolicy } from './memberships.access-policy';
import { MembershipsService } from './memberships.service';

@UseAccessPolicies(MembershipsAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
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
    validationPipeOptions: {
      whitelist: true,
    },
  },
).product {}
