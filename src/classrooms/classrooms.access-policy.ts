import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { CRUD_FILTERS } from 'src/common/crud-filters/crud-filters.token';
import { CrudFilters } from 'src/common/crud-filters/crud-filters.type';

import { ClassroomsResolver } from './classrooms.resolver';
import { ClassroomsService } from './classrooms.service';

type ActionName = keyof ClassroomsResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;
@Injectable()
export class ClassroomsAccessPolicy
  implements AccessPolicy<ActionName, Request>
{
  @Inject()
  service: ClassroomsService;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: [
          'queryMany',
          'queryOne',
          'createOne',
          'updateOne',
          'deleteOne',
        ],
        effect: Effect.Allow,
      },
      {
        actions: ['updateOne'],
        effect: Effect.Allow,
        conditions: [this.asCreator],
        reason: 'Only the creator can update the classroom',
      },
      {
        actions: ['deleteOne'],
        effect: Effect.Allow,
        conditions: [this.asCreator],
        reason: 'Only the creator can destroy the classroom',
      },
    ];
  }

  asCreator: Condition = async ({ req }) =>
    (await this.getEntity(req)).creator == req.user;

  async getEntity({ params: { id }, user }: Request) {
    return await this.service.retrieve(+id, {
      filters: this.filters(user),
    });
  }
}
