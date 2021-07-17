import { EntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { User } from 'src/users/entities/user.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { Role } from './role.enum';

@Injectable()
export class MembershipsService extends new MikroCrudServiceFactory({
  entityClass: Membership,
  dtoClasses: { create: CreateMembershipDto, update: UpdateMembershipDto },
}).product {
  async create({
    data,
    user,
  }: {
    data: CreateMembershipDto | EntityData<Membership>;
    user: User;
  }) {
    return await super.create({ data: { ...data, owner: user }, user });
  }

  async getWeight(membership: Membership) {
    await membership.classroom.init();
    if (membership.owner == membership.classroom.creator) return 3;
    if (membership.role == Role.Teacher) return 2;
    return 1;
  }
}
