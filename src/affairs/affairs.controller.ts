import { Controller, UseGuards } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { AffairsAccessPolicy } from './affairs.access-policy';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@UseAccessPolicies(AffairsAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
@Controller()
export class AffairsController extends new MikroCrudControllerFactory({
  serviceClass: AffairsService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<Affair>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
  validationPipeOptions: {
    whitelist: true,
  },
}).product {}
