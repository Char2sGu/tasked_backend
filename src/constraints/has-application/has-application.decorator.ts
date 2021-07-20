import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { HasApplicationConstraintArguments } from './has-application-constraint-arguments.type';
import { HasApplicationConstraint } from './has-application.constraint';

/**
 * Check whether there is an application with the specified status sent by you in the classroom.
 * @param param0
 * @param options
 */
export const HasApplication = (
  [status]: HasApplicationConstraintArguments = [,],
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [status],
    options,
    target,
    propertyName,
    validator: HasApplicationConstraint,
  });
