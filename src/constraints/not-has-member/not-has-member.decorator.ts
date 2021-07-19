import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { NotHasMemberConstraint } from './not-has-member.constraint';

/**
 * Check if the classroom has a member with the spcified user ID.
 * @param userField - The field for retrieving the user ID, if not specified,
 * the request user is used.
 * @param options
 */
export const NotHasMember = <T>(
  userField?: string & keyof T,
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [userField],
    options,
    target,
    propertyName,
    validator: NotHasMemberConstraint,
  });
