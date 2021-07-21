import { ValidationArguments as BaseValidationArguments } from 'class-validator';
import { BodyContextAttached } from 'src/body-context/body-context-attached.dto';

export interface ValidationArguments<
  Constraints extends unknown[] = [],
  Object_ = Record<string, unknown>,
  ExtraContext = Record<string, unknown>
> extends BaseValidationArguments {
  object: BodyContextAttached<ExtraContext> & Object_;
  constraints: Constraints;
}
