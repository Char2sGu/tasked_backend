import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { ApplicationStatus } from './application-status.enum';
import { JoinApplicationsService } from './join-applications.service';

@Injectable()
export class JoinApplicationsAccessPolicy
  implements AccessPolicy<ActionName, Request> {
  @Inject()
  applicationService: JoinApplicationsService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.applicationService.retrieve({
        conditions: { id: +id },
        expand: ['classroom'],
        user,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  asCreator: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).classroom.creator == req.user;

  isRejected: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).status == ApplicationStatus.Rejected;

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'create', 'retrieve', 'update'],
      effect: Effect.Allow,
    },
    {
      actions: ['update'],
      effect: Effect.Allow,
      conditions: [this.asCreator],
      reason: 'Only the creator can manage the applications',
    },
    {
      actions: ['update'],
      effect: Effect.Forbid,
      conditions: [this.isRejected],
      reason: 'Rejected applications are forbidden to be updated',
    },
  ];
}
