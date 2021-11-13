import { Allow } from 'class-validator';

import { ValidationContext } from './validation-context.interface';
import { VALIDATION_CONTEXT } from './validation-context.symbol';

/**
 * A base class to derive DTO classes with a {@link ValidationContext} attached.
 */
export class ValidationContextAttached {
  @Allow()
  [VALIDATION_CONTEXT]?: ValidationContext;
}
