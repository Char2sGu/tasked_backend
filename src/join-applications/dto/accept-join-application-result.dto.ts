import { Field, ObjectType } from '@nestjs/graphql';
import { Membership } from 'src/memberships/entities/membership.entity';

import { JoinApplication } from '../entities/join-application.entity';

@ObjectType()
export class AcceptJoinApplicationResult {
  @Field(() => JoinApplication)
  application: JoinApplication;

  @Field(() => Membership)
  membership: Membership;
}
