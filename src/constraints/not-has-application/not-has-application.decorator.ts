import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import { NotHasApplicationConstraint } from './not-has-application.constraint';

export const NotHasApplication = (
  status?: ApplicationStatus,
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [status],
    options,
    target,
    propertyName,
    validator: NotHasApplicationConstraint,
  });
