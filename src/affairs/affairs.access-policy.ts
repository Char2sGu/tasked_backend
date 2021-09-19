import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';

import { AffairsService } from './affairs.service';
import { AffairCreateInput } from './dto/affair-create.input';

@Injectable()
export class AffairsAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  affairsService: AffairsService;

  @Inject()
  classroomsService: ClassroomsService;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.affairsService.retrieve({
        conditions: { id: +id },
        expand: ['classroom'],
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async getClassroomWhenCreating({ body, user }: Request) {
    const { classroom: id }: AffairCreateInput = body;
    return await this.classroomsService.retrieve(+id, {
      filters: this.filters(user),
      failHandler: () => new BadRequestException('Classroom not found'),
    });
  }
  asCreator: AccessPolicyCondition<ActionName, Request> = async ({
    action,
    req,
  }) => {
    const classroom =
      action == 'create'
        ? await this.getClassroomWhenCreating(req)
        : (await this.getEntity(req)).classroom;
    return classroom.creator == req.user;
  };

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
      effect: Effect.Allow,
    },
    {
      actions: ['create', 'update', 'destroy'],
      effect: Effect.Allow,
      conditions: [this.asCreator],
      reason: 'Only the creator is allowed to manage affairs',
    },
  ];
}
