import { BodyContext } from './body-context.type';

export interface BodyContextAttached<T = Record<string, unknown>> {
  _context?: BodyContext<T>;
}
