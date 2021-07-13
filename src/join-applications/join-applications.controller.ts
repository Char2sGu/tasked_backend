import { Controller, UseGuards } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsAccessPolicy } from './join-applications.access-policy';
import { JoinApplicationsService } from './join-applications.service';

@UseAccessPolicies(JoinApplicationsAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
@Controller()
export class JoinApplicationsController extends new MikroCrudControllerFactory<JoinApplicationsService>(
  {
    serviceClass: JoinApplicationsService,
    actions: ['list', 'create', 'retrieve', 'update'],
    lookup: { field: 'id', name: 'id' },
    queryDtoClass: new QueryDtoFactory<JoinApplication>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
  },
).product {}
