import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { SheduleItem } from './entities/shedule-item.entity';
import { SheduleItemsService } from './shedule-items.service';

export const PREFIX = `${ROOT_PREFIX}/shedule-items`;

@UseGuards(JwtAuthGuard)
@Controller(PREFIX)
export class SheduleItemsController extends new MikroCrudControllerFactory({
  serviceClass: SheduleItemsService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<SheduleItem>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
}).product {}
