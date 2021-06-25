import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { User } from 'src/users/entities/user.entity';

@Filter<Affair>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Affair extends BaseEntity<Affair> {
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Property()
  title: string;

  @Property()
  time: Date;

  @Property({
    nullable: true,
  })
  remark: string | null;

  @Property({
    default: true,
  })
  isActivated: boolean;
}
