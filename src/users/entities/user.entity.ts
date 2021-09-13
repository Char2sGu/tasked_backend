import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Gender } from 'src/users/gender.enum';

@ObjectType()
@Entity()
export class User extends BaseEntity<User> {
  @Field(() => String)
  @Property()
  @Unique()
  username: string;

  @Field(() => String, { nullable: true })
  @Property({
    nullable: true,
  })
  nickname?: string;

  @Property({})
  password: string;

  @Field(() => Gender)
  @Property()
  gender: Gender = Gender.Unknown;

  @Field(() => [Classroom])
  @OneToMany({
    entity: () => Classroom,
    mappedBy: (classroom) => classroom.creator,
  })
  classrooms = new Collection<Classroom>(this);

  @Field(() => [JoinApplication])
  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.owner,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @Field(() => [Membership])
  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => [Task])
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.creator,
  })
  tasks = new Collection<Task>(this);

  @Field(() => [Assignment])
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

declare module 'express' {
  interface Request {
    user?: User;
  }
}
