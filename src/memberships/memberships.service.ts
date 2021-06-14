import { EntityData } from '@mikro-orm/core';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory, RelationPath } from 'nest-mikro-crud';
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

  async destroy({
    entity: targetMembership,
    user,
  }: {
    entity: Membership;
    user: User;
  }) {
    await this.repository.populate(targetMembership, [
      'classroom',
    ] as RelationPath<Membership>[]);

    // forbid to delete the creator's membership
    if (targetMembership.classroom.creator == targetMembership.owner)
      throw new ForbiddenException();

    // skip when deleting one's own membership
    if (user == targetMembership.owner) return;

    // skip if the user is the creator
    if (user == targetMembership.classroom.creator) return;

    const ownMembership = await this.retrieve({
      conditions: {
        owner: user,
        classroom: targetMembership.classroom,
      },
      user,
    });

    // forbid students to delete any memberships
    if (ownMembership.role == Role.Student) throw new ForbiddenException();

    // firbid teachers to delete teachers
    if (
      ownMembership.role == Role.Teacher &&
      targetMembership.role == Role.Teacher
    )
      throw new ForbiddenException();

    return await super.destroy({ entity: targetMembership, user });
  }
}
