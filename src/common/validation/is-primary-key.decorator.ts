import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsPrimaryKeyConstraint } from './is-primary-key.constraint';

export const IsPrimaryKey =
  (entity: () => Type, options?: ValidationOptions): PropertyDecorator =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [entity],
      options,
      target,
      propertyName,
      validator: IsPrimaryKeyConstraint,
    });
