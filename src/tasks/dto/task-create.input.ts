import { ID, InputType } from '@nestjs/graphql';
import { Length, MaxLength } from 'class-validator';
import { Existence } from 'src/common/validation/existence.decorator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsService } from 'src/memberships/memberships.service';
import { Field } from 'src/shared/field.decorator';

@InputType()
export class TaskCreateInput extends ValidationContextAttached {
  @Field(() => String)
  @Length(1, 30)
  title: string;

  @Field(() => String, { nullable: true })
  @MaxLength(500)
  description?: string;

  @Field(() => ID)
  @Existence<Membership>(
    true,
    () => MembershipsService,
    (classroomId: number, user) => ({
      owner: user,
      classroom: classroomId,
    }),
    {
      message: 'classroom must be the ID of a classroom having your membership',
    },
  )
  classroom: number;
}
