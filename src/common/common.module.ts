import { Global, Module } from '@nestjs/common';

/**
 * Provide common injections globally for every feature modules.
 */
@Global()
@Module({})
export class CommonModule {}
