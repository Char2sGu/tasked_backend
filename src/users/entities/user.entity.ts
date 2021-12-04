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
import { PaginatedApplications } from 'src/applications/dto/paginated-applications.obj.dto';
import { Application } from 'src/applications/entities/application.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Orderable } from 'src/common/dto/order/orderable.decorator';
import { Field } from 'src/common/field.decorator';
import { PaginatedMemberships } from 'src/memberships/dto/paginated-memberships.obj.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { Quota } from 'src/mikro/mikro-quota/quota.decorator';
import { PaginatedRooms } from 'src/rooms/dto/paginated-rooms.obj.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { PaginatedTasks } from 'src/tasks/dto/paginated-tasks.obj.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { Gender } from 'src/users/entities/gender.enum';

@ObjectType()
@Entity()
export class User extends BaseEntity<User> {
  @Orderable()
  @Field(() => String)
  @Property({ unique: true })
  username: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  nickname?: string;

  @Property()
  password: string;

  @Field(() => Gender)
  @Property()
  gender: Gender = Gender.Unknown;

  @Quota(20)
  @Field(() => PaginatedRooms)
  @OneToMany({
    entity: () => Room,
    mappedBy: (room) => room.creator,
    orphanRemoval: true,
  })
  rooms = new Collection<Room>(this);

  @Field(() => PaginatedApplications)
  @OneToMany({
    entity: () => Application,
    mappedBy: (application) => application.owner,
    orphanRemoval: true,
  })
  applications = new Collection<Application>(this);

  @Field(() => PaginatedMemberships)
  @OneToMany({
    entity: () => Membership,
    mappedBy: (memberships) => memberships.owner,
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);

  @Field(() => PaginatedTasks)
  @OneToMany({
    entity: () => Task,
    mappedBy: (task) => task.creator,
    orphanRemoval: true,
  })
  tasks = new Collection<Task>(this);

  get isUpdatedRecently() {
    return dayjs(this.updatedAt).isAfter(dayjs().subtract(5, 'minute'));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    const HASHED_LENGTH = 60;
    if (this.password.length == HASHED_LENGTH) return;
    this.password = await hash(this.password, 10);
  }
}
