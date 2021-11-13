import { FilterQuery } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { CrudService } from 'src/crud/crud.service';
import { User } from 'src/users/entities/user.entity';

import { ExistenceConstraint } from './existence.constraint';

/**
 * A custom class-validator validation decorator to apply the
 * {@link ExistenceConstraint}.
 * @param shouldExist
 * @param serviceType
 * @param conditions
 * @param options
 * @returns
 */
export const Existence =
  <Entity>(
    shouldExist: boolean,
    serviceType: () => Type<{ crud: CrudService<Entity> }>, // TODO: decouple here
    conditions: (
      value: unknown,
      user: User,
      object: unknown,
    ) => FilterQuery<Entity>,
    options?: ValidationOptions,
  ): PropertyDecorator =>
  ({ constructor: target }, propertyName: string) =>
    registerDecorator({
      constraints: [shouldExist, serviceType, conditions],
      options,
      target,
      propertyName,
      validator: ExistenceConstraint,
    });
