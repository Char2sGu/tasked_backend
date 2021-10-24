import { User } from './users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
