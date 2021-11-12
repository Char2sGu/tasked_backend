import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Field } from 'src/shared/field.decorator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Classroom>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    deletedAt: null,
    $or: [{ memberships: { owner: user } }, { isOpen: true }],
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
  @Property()
  isOpen: boolean;

  @Field(() => User)
  @ManyToOne({
    entity: () => User,
  })
  creator: User;

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

  @Field(() => PaginatedAssignments)
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

  @Field(() => Membership, { nullable: true })
  membership: never;
}
