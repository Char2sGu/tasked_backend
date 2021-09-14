import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from './skip-auth.symbol';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
