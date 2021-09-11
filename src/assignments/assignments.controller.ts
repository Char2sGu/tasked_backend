import {
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessPolicyGuard, UseAccessPolicies } from 'nest-access-policy';
import { MikroCrudControllerFactory, QueryDtoFactory } from 'nest-mikro-crud';
import { ReqUser } from 'nest-mikro-crud/lib/decorators/req-user.decorator';
import { BodyContextInterceptor } from 'src/body-context.interceptor';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

import { AssignmentsAccessPolicy } from './assignments.access-policy';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './entities/assignment.entity';

@UseAccessPolicies(AssignmentsAccessPolicy)
@UseGuards(JwtAuthGuard, AccessPolicyGuard)
@UseInterceptors(BodyContextInterceptor)
@Controller()
export class AssignmentsController extends new MikroCrudControllerFactory({
  serviceClass: AssignmentsService,
  actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id', name: 'id' },
  queryDtoClass: new QueryDtoFactory<Assignment>({
    limit: { max: 200, default: 50 },
    offset: { max: 2000 },
  }).product,
  validationPipeOptions: {
    whitelist: true,
  },
}).product {
  @Put('/:id/completion/')
  async makeCompleted(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: User,
  ) {
    const entity = await this.service
      .retrieve({ conditions: id, user })
      .catch(() => {
        throw new NotFoundException();
      });
    await this.service.update({ entity, data: { isCompleted: true }, user });
  }
}
