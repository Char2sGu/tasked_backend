import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Application } from 'src/applications/entities/application.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { CommonFilter } from 'src/common/common-filter.enum';
import { Field } from 'src/common/field.decorator';
import { Context } from 'src/context/context.class';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.obj.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Quota } from 'src/mikro/mikro-quota/quota.decorator';
import { User } from 'src/users/entities/user.entity';

@Filter<Room>({
  name: CommonFilter.Crud,
  cond: () => ({
    $or: [
      { memberships: { owner: Context.current.user, deletedAt: null } },
      { isOpen: true },
    ],
  }),
})
@Entity()
@ObjectType()
export class Room extends BaseEntity<Room> {
  @Field(() => String, { orderable: true, filterable: true })
  @Property()
  name: string;

  @Field(() => String, { nullable: true, orderable: true, filterable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Boolean, { orderable: true, filterable: true })
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => Application,
    mappedBy: (application) => application.room,
  })
  applications = new Collection<Application>(this);

  @Quota(50)
  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.room,
  })
  memberships = new Collection<Membership>(this);
}
