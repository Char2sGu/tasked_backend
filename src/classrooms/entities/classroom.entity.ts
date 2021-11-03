import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/utilities/field.decorator';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Classroom>({
  name: 'undeleted',
  cond: { deletedAt: null },
  default: true,
})
@Filter<Classroom>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    memberships: { owner: user },
  }),
})
@Entity()
export class Classroom extends BaseEntity<Classroom> {
  @Field(() => String)
  @Property()
  name: string;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  description?: string;

  @Field(() => Boolean)
  @Property({
    default: true,
  })
  isOpen: boolean;

  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
  })
  memberships = new Collection<Membership>(this);

  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.classroom,
  })
  assignments = new Collection<Assignment>(this);

  @Field(() => Date, { nullable: true })
  @Property({
    nullable: true,
  })
  deletedAt?: Date;

  membership: never;
}
