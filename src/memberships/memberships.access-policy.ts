import { Inject, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { MembershipsService } from './memberships.service';
import { Role } from './role.enum';

export class MembershipsAccessPolicy
  implements AccessPolicy<ActionName, Request> {
  isCreator: AccessPolicyCondition<ActionName, Request> = async ({ req }) => {
    const {
      owner,
      classroom: { creator },
    } = await this.getEntity(req);
    return owner == creator;
  };

  isOwn: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).owner == req.user;

  asCreator: AccessPolicyCondition<ActionName, Request> = async ({ req }) =>
    (await this.getEntity(req)).classroom.creator == req.user;

  asMorePowerful: AccessPolicyCondition<ActionName, Request> = async ({
    req,
  }) => {
    const own = await this.getOwnMembership(req);
    const target = await this.getEntity(req);

    const weightMap = {
      [Role.Student]: 0,
      [Role.Teacher]: 1,
    };
    const ownWeight = weightMap[own.role];
    const targetWeight = weightMap[target.role];

    return ownWeight > targetWeight;
  };

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'retrieve', 'destroy'],
      effect: Effect.Allow,
    },
    {
      actions: ['destroy'],
      effect: Effect.Forbid,
      conditions: [this.isCreator],
      reason: 'The membership of the creator cannot be destroyed',
    },
    {
      actions: ['destroy'],
      effect: Effect.Allow,
      conditions: [[this.isOwn, this.asCreator, this.asMorePowerful]],
      reason: 'Not eligible to delete this member',
    },
  ];

  @Inject()
  membershipsService: MembershipsService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.membershipsService.retrieve({
        conditions: { id: +id },
        expand: ['classroom'],
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async getOwnMembership(req: Request) {
    const { classroom } = await this.getEntity(req);
    return await this.membershipsService.retrieve({
      conditions: { owner: req.user, classroom },
      expand: ['classroom'],
      user: req.user,
    });
  }
}
