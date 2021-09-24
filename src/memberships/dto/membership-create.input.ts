import { InputType } from '@nestjs/graphql';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';

@InputType()
export class MembershipCreateInput extends ValidationContextAttached {}
