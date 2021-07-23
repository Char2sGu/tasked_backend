import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/base-entity.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from '../role.enum';

@Filter<Membership>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Membership extends BaseEntity<Membership> {
  @ManyToOne({
    entity: () => User,
  })
  owner: User;

  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Property({
    nullable: true,
  })
  displayName: string | null;

  @Property()
  role: Role;

  async getWeight() {
    await this.classroom.init();
    if (this.owner == this.classroom.creator) return 3;
    if (this.role == Role.Teacher) return 2;
    return 1;
  }
}
