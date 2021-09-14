import { Controller, UseGuards } from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';

import { ClassroomsAccessPolicy } from './classrooms.access-policy';
import { ClassroomsService } from './classrooms.service';
import { Classroom } from './entities/classroom.entity';

@UseAccessPolicies(ClassroomsAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
@Controller()
export class ClassroomsController extends new MikroCrudControllerFactory<ClassroomsService>(
  {
    serviceClass: ClassroomsService,
    actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
    lookup: { field: 'id', name: 'id' },
    queryDtoClass: new QueryDtoFactory<Classroom>({
      limit: { max: 200, default: 50 },
      offset: { max: 2000 },
    }).product,
    validationPipeOptions: {
      whitelist: true,
    },
  },
).product {}
