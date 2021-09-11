import { EntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { User } from 'src/users/entities/user.entity';

import { CreateMembershipDto } from './dto/membership-create.input';
import { UpdateMembershipDto } from './dto/membership-update.input';
import { Membership } from './entities/membership.entity';

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
}
