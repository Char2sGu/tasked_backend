import { ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

@ObjectType()
export class ObtainTokenResult {
  @Field(() => String)
  token: string;
}
