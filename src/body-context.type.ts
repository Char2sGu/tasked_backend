import { Request } from 'express';

export type BodyContext<T = Record<string, unknown>> = Pick<Request, 'user'> &
  T;
