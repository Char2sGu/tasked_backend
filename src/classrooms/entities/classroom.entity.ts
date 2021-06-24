import {
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/base-entity.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { ScheduleItem } from 'src/schedule-items/entities/schedule-item.entity';
import { User } from 'src/users/entities/user.entity';

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
  @Property()
  name: string;

  @ManyToOne({
    entity: () => User,
  })
  creator: User;

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.classroom,
    hidden: true,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @OneToMany({
    entity: () => Membership,
    mappedBy: (membership) => membership.classroom,
    hidden: true,
  })
  memberships = new Collection<Membership>(this);

  @OneToMany({
    entity: () => ScheduleItem,
    mappedBy: (item) => item.classroom,
    hidden: true,
  })
  scheduleItems = new Collection<ScheduleItem>(this);

  @Property({
    hidden: true,
    nullable: true,
  })
  deletedAt: Date | null;
}
