import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  AccessPolicy,
  AccessPolicyCondition,
  AccessPolicyStatement,
  Effect,
} from 'nest-access-policy';
import { ActionName } from 'nest-mikro-crud';
import { ClassroomsService } from 'src/classrooms/classrooms.service';
import { AffairsService } from './affairs.service';
import { CreateAffairDto } from './dto/create-affair.dto';

@Injectable()
export class AffairsAccessPolicy implements AccessPolicy<ActionName, Request> {
  @Inject()
  affairsService: AffairsService;

  @Inject()
  classroomsService: ClassroomsService;

  async getEntity({ params: { id }, user }: Request) {
    try {
      return await this.affairsService.retrieve({
        conditions: { id: +id },
        expand: ['classroom'],
        user,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async getClassroomWhenCreating({ body, user }: Request) {
    const { classroom: id }: CreateAffairDto = body;
    return await this.classroomsService
      .retrieve({
        conditions: { id: +id },
        user,
      })
      .catch(() => {
        throw new BadRequestException('Classroom not found');
      });
  }
  asCreator: AccessPolicyCondition<ActionName, Request> = async ({
    action,
    req,
  }) => {
    const classroom =
      action == 'create'
        ? await this.getClassroomWhenCreating(req)
        : (await this.getEntity(req)).classroom;
    return classroom.creator == req.user;
  };

  statements: AccessPolicyStatement<ActionName, Request>[] = [
    {
      actions: ['list', 'create', 'retrieve', 'update', 'destroy'],
      effect: Effect.Allow,
    },
    {
      actions: ['create', 'update', 'destroy'],
      effect: Effect.Allow,
      conditions: [this.asCreator],
      reason: 'Only the creator is allowed to manage affairs',
    },
  ];
}
