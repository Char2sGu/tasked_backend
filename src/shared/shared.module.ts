import { Module } from '@nestjs/common';
import { MikroModule } from 'src/mikro/mikro.module';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * Provide shared providers for every feature providers.
 */
@Module({
  imports: [ValidationModule.forFeature(), MikroModule.forFeature()],
  exports: [ValidationModule, MikroModule],
})
export class SharedModule {}
