import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { HasMemberConstraintArguments } from './has-member-constraint-arguments.type';
import { HasMemberConstraint } from './has-member.constraint';

export const HasMember = <T>(
  [userField]: HasMemberConstraintArguments<T> = [,],
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [userField],
    options,
    target,
    propertyName,
    validator: HasMemberConstraint,
  });
