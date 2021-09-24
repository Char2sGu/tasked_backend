import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';

import { AffairsResolver } from './affairs.resolver';
import { AffairsService } from './affairs.service';
import { AffairCreateInput } from './dto/affair-create.input';

type ActionName = keyof AffairsResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class AffairsAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  private readonly affairsService: AffairsService;

  @Inject()
  private readonly classroomsService: ClassroomsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: [
          'queryMany',
          'createOne',
          'queryOne',
          'updateOne',
          'deleteOne',
        ],
        effect: Effect.Allow,
      },
      {
        actions: ['createOne', 'updateOne', 'deleteOne'],
        effect: Effect.Allow,
        conditions: [this.asCreator],
        reason: 'Only the creator can manage the affairs',
      },
    ];
  }

  private readonly asCreator: Condition = async ({ action, req }) => {
    const classroom =
      action == 'createOne'
        ? await this.getClassroomWhenCreating(req)
        : (await this.getEntity(req)).classroom;
    return classroom.creator == req.user;
  };

  private async getEntity({ params: { id }, user }: Request) {
    return this.affairsService.retrieve(+id, {
      populate: ['classroom'],
      filters: this.filters(user),
    });
  }

  private async getClassroomWhenCreating({ body, user }: Request) {
    const { classroom: id }: AffairCreateInput = body;
    return this.classroomsService.retrieve(+id, {
      filters: this.filters(user),
      failHandler: () => new BadRequestException('Classroom not found'),
    });
  }
}
