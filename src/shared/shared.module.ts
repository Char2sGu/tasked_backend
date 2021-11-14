import { Module } from '@nestjs/common';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * provide shared providers for every feature providers.
 */
@Module({
  providers: [ValidationModule],
  exports: [ValidationModule],
})
export class SharedModule {}
