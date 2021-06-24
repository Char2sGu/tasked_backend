import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ScheduleItem } from './entities/schedule-item.entity';
import { ScheduleItemsService } from './schedule-items.service';

export const PREFIX = `${ROOT_PREFIX}/schedule-items`;

@UseGuards(JwtAuthGuard)
@Controller(PREFIX)
export class ScheduleItemsController extends new MikroCrudControllerFactory({
  serviceClass: ScheduleItemsService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<ScheduleItem>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
}).product {}
