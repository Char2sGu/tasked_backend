import { ID, InputType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { CRUD_FILTER } from 'src/mikro-filters/crud-filter.constant';
import { User } from 'src/users/entities/user.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => User, [CRUD_FILTER])
  recipient: number;

  @Field(() => ID)
  @IsPrimaryKey(() => User, [CRUD_FILTER])
  task: number;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
