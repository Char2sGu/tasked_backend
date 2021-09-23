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

import { MembershipsResolver } from './memberships.resolver';
import { MembershipsService } from './memberships.service';

type ActionName = keyof MembershipsResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class MembershipsAccessPolicy
  implements AccessPolicy<ActionName, Request>
{
  @Inject()
  private readonly service: MembershipsService;

  @Inject(CRUD_FILTERS)
  private readonly filters: CrudFilters;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: ['queryMany', 'queryOne', 'deleteOne'],
        effect: Effect.Allow,
      },
      {
        actions: ['deleteOne'],
        effect: Effect.Forbid,
        conditions: [this.isCreator],
        reason: 'Cannot delete the membership of the creator',
      },
      {
        actions: ['deleteOne'],
        effect: Effect.Allow,
        conditions: [[this.isOwn, this.asCreator, this.asStronger]],
        reason: 'Cannot delete superior members',
      },
    ];
  }

  private readonly isCreator: Condition = async ({ req }) => {
    const membership = await this.getEntity(req);
    return membership.owner == membership.classroom.creator;
  };

  private readonly isOwn: Condition = async ({ req }) =>
    (await this.getEntity(req)).owner == req.user;

  private readonly asCreator: Condition = async ({ req }) =>
    (await this.getEntity(req)).classroom.creator == req.user;

  private readonly asStronger: Condition = async ({ req }) => {
    const ownWeight = await (await this.getOwnMembership(req)).getWeight();
    const targetWeight = await (await this.getEntity(req)).getWeight();
    return ownWeight > targetWeight;
  };

  private async getEntity({ params: { id }, user }: Request) {
    return await this.service.retrieve(+id, {
      populate: ['classroom'],
      filters: this.filters(user),
    });
  }

  private async getOwnMembership(req: Request) {
    const { classroom } = await this.getEntity(req);
    return await this.service.retrieve(
      { owner: req.user, classroom },
      {
        populate: ['classroom'],
        filters: this.filters(req.user),
      },
    );
  }
}
