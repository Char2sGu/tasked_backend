import { Inject, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { MembershipsService } from 'src/memberships/memberships.service';
import { ApplicationStatus } from './application-status.enum';
import { CreateJoinApplicationDto } from './dto/create-join-application.dto';
import { JoinApplicationsService } from './join-applications.service';

export class JoinApplicationsAccessPolicy
  implements AccessPolicy<ActionName, Request> {
  existsPendingRequest: AccessPolicyCondition<ActionName, Request> = async ({
    req: { body, user },
  }) => {
    try {
      const { classroom }: CreateJoinApplicationDto = body;
      await this.applicationService.retrieve({
        conditions: {
          owner: user,
          classroom,
          status: ApplicationStatus.Pending,
        },
        user,
      });
      return true;
    } catch {
      return false;
    }
  };

  existsMembership: AccessPolicyCondition<ActionName, Request> = async ({
    req: { body, user },
  }) => {
    try {
      const { classroom }: CreateJoinApplicationDto = body;
      await this.membershipsService.retrieve({
        conditions: { owner: user, classroom },
        user,
      });
      return true;
    } catch {
      return false;
    }
  };

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
      actions: ['create'],
      effect: Effect.Forbid,
      conditions: [this.existsPendingRequest],
      reason: 'A pending application already exists',
    },
    {
      actions: ['create'],
      effect: Effect.Forbid,
      conditions: [this.existsMembership],
      reason: 'Already a member',
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

  @Inject()
  applicationService: JoinApplicationsService;

  @Inject()
  membershipsService: MembershipsService;

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
}
