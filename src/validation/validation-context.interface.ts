import { User } from 'src/users/entities/user.entity';

/**
 * Providing context for advanced validations.
 */
export interface ValidationContext {
  user: User;
}
