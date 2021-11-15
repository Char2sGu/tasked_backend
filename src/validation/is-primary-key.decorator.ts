import { AnyEntity, FindOneOptions } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

export const IsPrimaryKey =
  (
    entityType: () => Type<AnyEntity>,
    filters?: FindOneOptions<never>['filters'],
    options?: ValidationOptions,
  ) =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [entityType, filters],
      options,
      target,
      propertyName,
      validator: IsPrimaryKeyConstraint,
    });
