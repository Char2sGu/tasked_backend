import { applyDecorators, Type } from '@nestjs/common';
import {
  Field as FieldBase,
  FieldOptions as FieldOptionsBase,
  ReturnTypeFunc,
} from '@nestjs/graphql';
import { Expose, Type as TransformType } from 'class-transformer';
import { Allow, IsOptional, ValidateNested } from 'class-validator';

/**
 * Combine the decorators from `class-validator` and `class-transformer` into
 * the `@Field()` to avoid repeating options.
 * @param returnType
 * @param options
 * @returns
 */
export const Field = (returnType?: ReturnTypeFunc, options?: FieldOptions) => {
  const decorators = [FieldBase(returnType, options)];

  // class-validator
  decorators.push(Allow());
  if (options?.nullable) decorators.push(IsOptional());
  if (options?.nested) decorators.push(ValidateNested());

  // class-transformer
  decorators.push(Expose());
  if (options?.nested)
    decorators.push(
      TransformType(() => extractItemIfArray(returnType() as Type)),
    );

  return applyDecorators(...decorators);
};

function extractItemIfArray<T>(value: T | T[]) {
  return value instanceof Array ? value[0] : value;
}

interface FieldOptions extends FieldOptionsBase {
  nested?: boolean;
}
