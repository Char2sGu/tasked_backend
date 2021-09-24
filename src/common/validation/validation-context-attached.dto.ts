import { Allow } from 'class-validator';

import { ValidationContext } from './validation-context.interface';

/**
 * A base class to derive DTO classes with a {@link ValidationContext} attached.
 */
export class ValidationContextAttached {
  @Allow()
  _context?: ValidationContext;
}
