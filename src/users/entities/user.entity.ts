import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { PaginatedAssignments } from 'src/assignments/dto/paginated-assignments.dto';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { PaginatedClassrooms } from 'src/classrooms/dto/paginated-classrooms.dto';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/utilities/field.decorator';
import { PaginatedJoinApplications } from 'src/join-applications/dto/paginated-join-applications.dto';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { Gender } from 'src/users/entities/gender.enum';

@ObjectType()
@Entity()
export class User extends BaseEntity<User> {
  @Field(() => String)
  @Property({
    unique: true,
  })
  username: string;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  nickname?: string;

  @Property()
  password: string;

  @Field(() => Gender)
  @Property()
  gender: Gender = Gender.Unknown;

  @Field(() => PaginatedClassrooms)
  @OneToMany({
    entity: () => Classroom,
    mappedBy: (classroom) => classroom.creator,
  })
  classrooms = new Collection<Classroom>(this);

  @Field(() => PaginatedJoinApplications)
  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.owner,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedTasks)
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.creator,
  })
  tasks = new Collection<Task>(this);

  @Field(() => PaginatedAssignments)
  @OneToMany({
    entity: () => Assignment,
    mappedBy: (assignment) => assignment.recipient,
  })
  assignments = new Collection<Assignment>(this);

  get isUpdatedRecently() {
    const DAYS = 3;
    return dayjs(this.updatedAt).isAfter(dayjs().subtract(DAYS, 'd'));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    const HASHED_LENGTH = 60;
    if (this.password.length == HASHED_LENGTH) return;
    this.password = await hash(this.password, 10);
  }
}
