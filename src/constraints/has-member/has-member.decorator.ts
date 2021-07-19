import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { registerDecorator } from 'class-validator';
import { HasMemberConstraint } from './has-member.constraint';

export const HasMember = <T>(
  userField?: string & keyof T,
  options?: ValidatorOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [userField],
    options,
    target,
    propertyName,
    validator: HasMemberConstraint,
  });
