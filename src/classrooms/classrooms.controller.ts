import { Controller, UseGuards } from '@nestjs/common';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ROOT_PREFIX } from 'src/app.controller';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

export const PREFIX = `${ROOT_PREFIX}/classrooms`;

@UseGuards(JwtAuthGuard)
@Controller(PREFIX)
export class ClassroomsController extends new MikroCrudControllerFactory<ClassroomsService>(
  {
    serviceClass: ClassroomsService,
    actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
    lookup: { field: 'id', name: 'id' },
    queryDtoClass: new QueryDtoFactory<Classroom>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
  },
).product {}
