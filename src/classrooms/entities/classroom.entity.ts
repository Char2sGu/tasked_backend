import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { PaginatedAffairs } from 'src/affairs/dto/paginated-affairs.dto';
import { Affair } from 'src/affairs/entities/affair.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Classroom>({
  name: 'exclude-soft-deleted',
  cond: { deletedAt: null },
  default: true,
})
@Filter<Classroom>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    memberships: { owner: user },
  }),
})
@Entity()
export class Classroom extends BaseEntity<Classroom> {
  @Field(() => String)
  @Property()
  name: string;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @Field(() => PaginatedJoinApplications)
  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedAffairs)
  @OneToMany({
    entity: () => Affair,
    mappedBy: (item) => item.classroom,
  })
  affairs = new Collection<Affair>(this);

  @Field(() => Date, { nullable: true })
  @Property({
    nullable: true,
  })
  deletedAt?: Date;
}
