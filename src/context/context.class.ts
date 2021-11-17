import { Request } from 'express';

export class Context {
  constructor(public request: Request) {}
}
