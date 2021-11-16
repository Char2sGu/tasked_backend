import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { Field } from 'src/common/field.decorator';
import { BaseEntity } from 'src/mikro/base-entity.entity';
import { CRUD_FILTER } from 'src/mikro/mikro-filters.constants';
import { User } from 'src/users/entities/user.entity';

import { Role } from './role.enum';

@ObjectType()
@Filter<Membership>({
  name: CRUD_FILTER,
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Membership extends BaseEntity<Membership> {
  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @Field(() => Classroom)
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Field(() => Role)
  @Property()
  role: Role;
}
