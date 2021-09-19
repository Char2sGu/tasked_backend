import { Entity, Filter, ManyToOne, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { BaseEntity } from 'src/common/base-entity.entity';
import { Field } from 'src/common/field.decorator';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Filter<Affair>({
  name: 'crud',
  cond: ({ user }: { user: User }) => ({
    classroom: { memberships: { owner: user } },
  }),
})
@Entity()
export class Affair extends BaseEntity<Affair> {
  @Field(() => [Classroom])
  @ManyToOne({
    entity: () => Classroom,
  })
  classroom: Classroom;

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => Date)
  @Property()
  timeStart: Date;

  @Field(() => Date)
  @Property()
  timeEnd: Date;

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
