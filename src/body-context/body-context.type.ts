import { Request } from 'express';

export type BodyContext = Pick<Request, 'user'>;
