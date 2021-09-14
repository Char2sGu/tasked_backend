import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

type ActionName = keyof UsersResolver;
type Condition = AccessPolicyCondition<ActionName, Request>;

@Injectable()
export class UsersAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  usersService: UsersService;

  get statements(): AccessPolicyStatement<ActionName, Request>[] {
    return [
      {
        actions: [
          'queryUsers',
          'queryUser',
          'queryCurrent',
          'updateUser',
          'createUser',
        ],
        effect: Effect.Allow,
      },
      {
        actions: ['updateUser'],
        effect: Effect.Allow,
        conditions: [this.isSelf],
        reason: 'Cannot update other users',
      },
      {
        actions: ['updateUser'],
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
    try {
      return await this.usersService.retrieve({
        conditions: +id,
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }
}
