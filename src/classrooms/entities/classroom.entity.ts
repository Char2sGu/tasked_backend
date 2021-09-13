import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Affair } from 'src/affairs/entities/affair.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
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

  @Field(() => [JoinApplication])
  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
    hidden: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => [Membership])
  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
    hidden: true,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => [Affair])
  @OneToMany({
    entity: () => Affair,
    mappedBy: (item) => item.classroom,
    hidden: true,
  })
  affairs = new Collection<Affair>(this);

  @Field(() => Date, { nullable: true })
  @Property({
    hidden: true,
    nullable: true,
  })
  deletedAt?: Date;
}
