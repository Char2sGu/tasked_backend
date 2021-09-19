import { Allow } from 'class-validator';

import { ValidationContext } from './validation-context.interface';

export class ValidationContextAttached {
  @Allow()
  _context?: ValidationContext;
}
