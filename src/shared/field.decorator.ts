import { applyDecorators } from '@nestjs/common';
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    decorators.push(TransformType(returnType as () => Function));

  return applyDecorators(...decorators);
};

interface FieldOptions extends FieldOptionsBase {
  nested?: boolean;
}
