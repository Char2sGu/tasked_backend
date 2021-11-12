import { SetMetadata } from '@nestjs/common';

import { AUTH_GUARD_SKIP } from './auth-guard-skip.symbol';

/**
 * Apply to a routing method to skip the authentication check.
 * @see {JwtAuthGuard}
 * @returns
 */
export const AuthGuardSkip = () => SetMetadata(AUTH_GUARD_SKIP, true);
