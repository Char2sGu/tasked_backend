import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { TasksService } from './tasks.service';

@Injectable()
export class TasksAccessPolicy implements AccessPolicy<ActionName, Request> {
  isOwn: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).creator == req.user;

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
      effect: Effect.Allow,
    },
    {
      actions: ['update', 'destroy'],
      effect: Effect.Allow,
      conditions: [this.isOwn],
      reason: 'Only the tasks created by yourself can be managed',
    },
  ];

  @Inject()
  tasksService: TasksService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.tasksService.retrieve({
        conditions: { id: +id },
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }
}
