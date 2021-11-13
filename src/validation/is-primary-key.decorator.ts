import { AnyEntity } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

export const IsPrimaryKey =
  (entityType: () => Type<AnyEntity>, options?: ValidationOptions) =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [entityType],
      options,
      target,
      propertyName,
      validator: IsPrimaryKeyConstraint,
    });
