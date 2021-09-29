import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { Int, ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Affair>({
  name: 'visible',
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Affair extends BaseEntity<Affair> {
  @Field(() => Classroom)
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => Date)
  @Property()
  date: Date;

  @Field(() => Int)
  @Property()
  duration: number;

  @Field(() => String)
  @Property({
    nullable: true,
  })
  remark?: string;

  @Field(() => Boolean)
  @Property({
    default: true,
  })
  isActivated: boolean;
}
