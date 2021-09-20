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

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

type ActionName = keyof UsersResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class UsersAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  service: UsersService;

  @Inject(CRUD_FILTERS)
  filters: CrudFilters;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: [
          'queryMany',
          'queryOne',
          'queryCurrent',
          'updateOne',
          'createOne',
        ],
        effect: Effect.Allow,
      },
      {
        actions: ['updateOne'],
        effect: Effect.Allow,
        conditions: [this.isSelf],
        reason: 'Cannot update other users',
      },
      {
        actions: ['updateOne'],
        effect: Effect.Forbid,
        conditions: [this.isUpdatedRecently],
        reason: 'Cannot update again within 3 days',
      },
    ];
  }

  isSelf: Condition = async ({ req }) =>
    (await this.getEntity(req)) == req.user;

  isUpdatedRecently: Condition = async ({ req }) => req.user.isUpdatedRecently;

  async getEntity({ params: { id }, user }: Request) {
    return await this.service.retrieve(+id, {
      filters: this.filters(user),
    });
  }
}
