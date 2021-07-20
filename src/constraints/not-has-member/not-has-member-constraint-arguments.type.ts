import { HasMemberConstraintArguments } from '../has-member/has-member-constraint-arguments.type';

export type NotHasMmemberConstraintArgument<
  T = unknown
> = HasMemberConstraintArguments<T>;
