import { EntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { User } from 'src/users/entities/user.entity';

import { MembershipCreateInput } from './dto/membership-create.input';
import { MembershipUpdateInput } from './dto/membership-update.input';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService extends new MikroCrudServiceFactory({
  entityClass: Membership,
  dtoClasses: { create: MembershipCreateInput, update: MembershipUpdateInput },
}).product {
  async create({
    data,
    user,
  }: {
    data: MembershipCreateInput | EntityData<Membership>;
    user: User;
  }) {
    return await super.create({ data: { ...data, owner: user }, user });
  }
}
