import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_METADATA_KEY = Symbol('skip-auth');

export const SkipAuth = () => SetMetadata(SKIP_AUTH_METADATA_KEY, true);
