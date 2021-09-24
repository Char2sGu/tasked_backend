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

import { ApplicationStatus } from './entities/application-status.enum';
import { JoinApplicationsResolver } from './join-applications.resolver';
import { JoinApplicationsService } from './join-applications.service';

type ActionName = keyof JoinApplicationsResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;
@Injectable()
export class JoinApplicationsAccessPolicy
  implements AccessPolicy<ActionName, Request>
{
  @Inject()
  private readonly service: JoinApplicationsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: ['queryMany', 'createOne', 'queryOne', 'updateOne'],
        effect: Effect.Allow,
      },
      {
        actions: ['updateOne'],
        effect: Effect.Allow,
        conditions: [this.asCreator],
        reason: 'Cannot manage applications that were not created by you',
      },
      {
        actions: ['updateOne'],
        effect: Effect.Forbid,
        conditions: [this.isRejected],
        reason: 'Cannot modify rejected applications',
      },
    ];
  }

  private readonly asCreator: Condition = async ({ req }) =>
    (await this.getEntity(req)).classroom.creator == req.user;

  private readonly isRejected: Condition = async ({ req }) =>
    (await this.getEntity(req)).status == ApplicationStatus.Rejected;

  private async getEntity({ params: { id }, user }: Request) {
    return this.service.retrieve(+id, {
      populate: ['classroom'],
      filters: this.filters(user),
    });
  }
}
