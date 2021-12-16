import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';
import { Membership } from 'src/memberships/entities/membership.entity';

import { Application } from '../entities/application.entity';

@ObjectType()
export class AcceptApplicationResult {
  @Field(() => Application)
  application: Application;

  @Field(() => Membership)
  membership: Membership;
}
