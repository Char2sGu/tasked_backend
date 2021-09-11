import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';

import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';

type Action = keyof AssignmentsController;

@Injectable()
export class AssignmentsAccessPolicy implements AccessPolicy<Action, Request> {
  @Inject()
  assignmentsService: AssignmentsService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.assignmentsService.retrieve({ conditions: +id, user });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  isReceived: AccessPolicyCondition<Action, Request> = async ({ req }) =>
    (await this.getEntity(req)).recipient == req.user;

  isAssigned: AccessPolicyCondition<Action, Request> = async ({ req }) =>
    (await (await this.getEntity(req)).task.init()).creator == req.user;

  statements: AccessPolicyStatement<Action, Request>[] = [
    {
      actions: [
        'list',
        'create',
        'retrieve',
        'update',
        'destroy',
        'makeCompleted',
      ],
      effect: Effect.Allow,
    },
    {
      actions: ['makeCompleted'],
      effect: Effect.Allow,
      conditions: [this.isReceived],
      reason: 'Only received assignments can be completed',
    },
    {
      actions: ['update', 'destroy'],
      effect: Effect.Allow,
      conditions: [this.isAssigned],
      reason: 'Only assigned assignments can be managed',
    },
  ];
}
