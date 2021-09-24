import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from './skip-auth.symbol';

/**
 * Apply to a routing method to skip the authentication check.
 * @see {JwtAuthGuard}
 * @returns
 */
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
