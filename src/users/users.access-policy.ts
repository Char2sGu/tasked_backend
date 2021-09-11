import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type ActionName = keyof UsersController;

@Injectable()
export class UsersAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  usersService: UsersService;

  async getEntity({ params: { username }, user }: Request) {
    try {
      return await this.usersService.retrieve({
        conditions: { username },
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  isSelf: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)) == req.user;

  isUpdatedRecently: AccessPolicyCondition<ActionName, Request> = async ({
    req,
  }) => req.user.isUpdatedRecently;

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'update', 'current'],
      effect: Effect.Allow,
    },
    {
      actions: ['update'],
      effect: Effect.Allow,
      conditions: [this.isSelf],
      reason: 'Updating other users is forbidden',
    },
    {
      actions: ['update'],
      effect: Effect.Forbid,
      conditions: [this.isUpdatedRecently],
      reason: 'Updating is forbidden within 3 days',
    },
  ];
}
