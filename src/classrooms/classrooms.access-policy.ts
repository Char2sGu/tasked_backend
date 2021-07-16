import { Inject, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { ClassroomsService } from './classrooms.service';

export class ClassroomsAccessPolicy
  implements AccessPolicy<ActionName, Request> {
  @Inject()
  classroomsService: ClassroomsService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.classroomsService.retrieve({
        conditions: { id: +id },
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  asCreator: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).creator == req.user;

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
      effect: Effect.Allow,
    },
    {
      actions: ['update'],
      effect: Effect.Allow,
      conditions: [this.asCreator],
      reason: 'Only the creator can update the classroom',
    },
    {
      actions: ['destroy'],
      effect: Effect.Allow,
      conditions: [this.asCreator],
      reason: 'Only the creator can desetroy the classroom',
    },
  ];
}
