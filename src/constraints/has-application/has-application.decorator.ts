import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import { HasApplicationConstraint } from './has-application.constraint';

/**
 * Check whether there is an application with the specified status sent by you in the classroom.
 * @param status
 * @param options
 */
export const HasApplication = (
  status?: ApplicationStatus,
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [status],
    options,
    target,
    propertyName,
    validator: HasApplicationConstraint,
  });
