import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { NotHasApplicationConstraintArguments } from './not-has-application-constraint-arguments.type';
import { NotHasApplicationConstraint } from './not-has-application.constraint';

export const NotHasApplication = (
  [status]: NotHasApplicationConstraintArguments = [,],
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [status],
    options,
    target,
    propertyName,
    validator: NotHasApplicationConstraint,
  });
