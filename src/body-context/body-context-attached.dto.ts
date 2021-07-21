import { Allow } from 'class-validator';
import { BodyContext } from './body-context.type';

export class BodyContextAttached<ExtraContext = Record<string, unknown>> {
  @Allow()
  _context?: BodyContext<ExtraContext>;
}
