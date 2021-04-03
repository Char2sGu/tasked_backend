import { Request } from 'express';

export interface ExpressRequest extends Request {
  user: Request['user'];
}

export { Response as ExpressResponse } from 'express';
