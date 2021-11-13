import { ValidationArguments as BaseValidationArguments } from 'class-validator';
import { ValidationContextAttached } from 'src/validation/validation-context-attached.dto';

/**
 * A wrap of class-validator's base `ValidationArguments` which provides better
 * type supports for validation.
 * @see {ValidationContextInterceptor}
 * @see {ValidationContextAttached}
 * @see {ValidationContextInterface}
 */
export interface ValidationArguments<
  Constraints extends unknown[] = [],
  Object_ = Record<string, unknown>,
> extends BaseValidationArguments {
  object: ValidationContextAttached & Object_;
  constraints: Constraints;
}
