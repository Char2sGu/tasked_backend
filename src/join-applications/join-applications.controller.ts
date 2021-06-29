import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { JoinApplication } from './entities/join-application.entity';
import { JoinApplicationsService } from './join-applications.service';

@UseGuards(JwtAuthGuard)
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
