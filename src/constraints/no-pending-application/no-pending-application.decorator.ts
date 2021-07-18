import { registerDecorator, ValidationOptions } from 'class-validator';
import { NoPendingApplicaitonConstraint } from './no-pending-application.constraint';

/**
 * Check if there aren't any pending applications sent by the user to the classroom.
 * @param options
 */
export const NoPendingApplication = (
  options?: ValidationOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    target,
    propertyName,
    validator: NoPendingApplicaitonConstraint,
    options,
  });
