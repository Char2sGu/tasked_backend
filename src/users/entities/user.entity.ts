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
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
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

  @OneToMany({
    entity: () => Classroom,
    mappedBy: (classroom) => classroom.creator,
  })
  classrooms = new Collection<Classroom>(this);

  @OneToMany({
    entity: () => JoinApplication,
    mappedBy: (application) => application.owner,
  })
  joinApplications = new Collection<JoinApplication>(this);

  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
  })
  memberships = new Collection<Membership>(this);

  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.creator,
  })
  tasks = new Collection<Task>(this);

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
