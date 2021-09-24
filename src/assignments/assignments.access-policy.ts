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

import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsService } from './assignments.service';

type ActionName = keyof AssignmentsResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class AssignmentsAccessPolicy
  implements AccessPolicy<ActionName, Request>
{
  @Inject()
  private readonly service: AssignmentsService;

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
          'completeOne',
        ],
        effect: Effect.Allow,
      },
      {
        actions: ['completeOne'],
        effect: Effect.Allow,
        conditions: [this.isReceived],
        reason: 'Only received assignments can be completed',
      },
      {
        actions: ['updateOne', 'deleteOne'],
        effect: Effect.Allow,
        conditions: [this.isAssigned],
        reason: 'Only assigned assignments can be managed',
      },
    ];
  }

  private readonly isReceived: Condition = async ({ req }) =>
    (await this.getEntity(req)).recipient == req.user;

  private readonly isAssigned: Condition = async ({ req }) =>
    (await (await this.getEntity(req)).task.init()).creator == req.user;

  private async getEntity({ params: { id }, user }: Request) {
    return this.service.retrieve(+id, {
      filters: this.filters(user),
    });
  }
}
