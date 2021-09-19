import { ValidationArguments as BaseValidationArguments } from 'class-validator';
import { ValidationContextAttached } from 'src/common/validation/validation-context-attached.dto';

export interface ValidationArguments<
  Constraints extends unknown[] = [],
  Object_ = Record<string, unknown>,
> extends BaseValidationArguments {
  object: ValidationContextAttached & Object_;
  constraints: Constraints;
}
