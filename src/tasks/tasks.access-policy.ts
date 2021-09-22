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

import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

type ActionName = keyof TasksResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class TasksAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  service: TasksService;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

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
        actions: ['updateOne', 'deleteOne'],
        effect: Effect.Allow,
        conditions: [this.isOwn],
        reason: 'Cannot manage tasks created by others',
      },
    ];
  }

  isOwn: Condition = async ({ req }) =>
    (await this.getEntity(req)).creator == req.user;

  async getEntity({ params: { id }, user }: Request) {
    return await this.service.retrieve(+id, {
      filters: this.filters(user),
    });
  }
}
