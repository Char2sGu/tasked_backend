import { ID, InputType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { FilterName } from 'src/common/filter-name.enum';
import { User } from 'src/users/entities/user.entity';
import { IsPrimaryKey } from 'src/validation/is-primary-key.decorator';

@InputType()
export class AssignmentCreateInput {
  @Field(() => ID)
  @IsPrimaryKey(() => User, [FilterName.CRUD])
  recipient: number;

  @Field(() => ID)
  @IsPrimaryKey(() => User, [FilterName.CRUD])
  task: number;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}
