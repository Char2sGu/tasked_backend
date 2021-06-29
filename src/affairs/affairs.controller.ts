import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { AffairsService } from './affairs.service';
import { Affair } from './entities/affair.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class AffairsController extends new MikroCrudControllerFactory({
  serviceClass: AffairsService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<Affair>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
}).product {}
