import { NonFunctionPropertyNames } from '@mikro-orm/core/typings';
import { Type } from '@nestjs/common';
import {
  ResolveField as ResolveFieldBase,
  ResolveFieldOptions,
  ReturnTypeFunc,
} from '@nestjs/graphql';

/**
 * Provide better type support.
 * @param entityType
 * @param field
 * @param returnType
 * @param options
 * @returns
 */
export const ResolveField =
  <Entity, Field extends Extract<NonFunctionPropertyNames<Entity>, string>>(
    entityType: () => Type<Entity>,
    field: Field,
    returnType: ReturnTypeFunc,
    options?: ResolveFieldOptions,
  ) =>
  (
    prototype: unknown,
    propertyKey: `resolve${Capitalize<Field>}`,
    descriptor: PropertyDescriptor,
  ) =>
    ResolveFieldBase(field, returnType, options)(
      prototype,
      propertyKey,
      descriptor,
    );

type Capitalize<T extends string> = T extends `${infer A}${infer B}`
  ? `${Uppercase<A>}${B}`
  : never;
