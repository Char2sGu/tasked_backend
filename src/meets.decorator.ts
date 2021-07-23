import { FilterQuery } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { MikroCrudService } from 'nest-mikro-crud';
import { MeetsConstraint } from './meets.constraint';
import { User } from './users/entities/user.entity';

export const Meets = <Entity>(
  type: 'exists' | 'not-exists',
  serviceType: () => Type<MikroCrudService<Entity>>,
  getConditions: (
    value: unknown,
    user: User,
    object: unknown,
  ) => FilterQuery<Entity>,
  options?: ValidationOptions,
): PropertyDecorator => ({ constructor: target }, propertyName: string) =>
  registerDecorator({
    constraints: [type, serviceType, getConditions],
    options,
    target,
    propertyName,
    validator: MeetsConstraint,
  });
