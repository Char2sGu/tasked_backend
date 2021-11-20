import './soft-deletable-handler.subscriber';

import { Filter, FilterQuery } from '@mikro-orm/core';
import { OperatorMap } from '@mikro-orm/core/dist/typings';
import { Type } from '@nestjs/common';

import { SOFT_DELETABLE } from './soft-deletable.symbol';
import { SOFT_DELETABLE_FILTER } from './soft-deletable-filter.constant';
import { SoftDeletableFilterArgs } from './soft-deletable-filter-args.interface';
import { SoftDeletableMetadata } from './soft-deletable-metadata.interface';

/**
 *
 * @param type - Helper to infer the generic types.
 * @param field
 * @param value
 * @returns
 */
export const SoftDeletable =
  <Entity, Field extends keyof Entity>(
    type: () => Type<Entity>,
    field: Field,
    value: () => Entity[Field],
  ) =>
  (type: Type<Entity>) => {
    const metadata: SoftDeletableMetadata<Entity, Field> = { field, value };
    Reflect.defineMetadata(SOFT_DELETABLE, metadata, type);

    Filter<Entity>({
      name: SOFT_DELETABLE_FILTER,
      cond: ({ includeDeleted = false }: SoftDeletableFilterArgs = {}) =>
        ({
          [field]: includeDeleted
            ? ({ $ne: null } as OperatorMap<Entity[Field]>)
            : null,
        } as FilterQuery<Entity>),
      default: true,
    })(type);
  };
