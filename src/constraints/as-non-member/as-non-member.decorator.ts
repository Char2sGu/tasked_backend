import { registerDecorator, ValidationOptions } from 'class-validator';
import { AsNonMemberConstraint } from './as-non-member.constraint';

/**
 * Check if the user is not a member of a classroom.
 * @param options
 */
export const AsNonMember = (options?: ValidationOptions): PropertyDecorator => (
  { constructor: target },
  propertyName: string,
) =>
  registerDecorator({
    target,
    propertyName,
    validator: AsNonMemberConstraint,
    options,
  });
