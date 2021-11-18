import { Module } from '@nestjs/common';
import { ContextModule } from 'src/context/context.module';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * Provide shared providers for every feature providers.
 */
@Module({
  imports: [ValidationModule.forFeature(), ContextModule.forFeature()],
  exports: [ValidationModule, ContextModule],
})
export class SharedModule {}
