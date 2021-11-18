import { Module } from '@nestjs/common';
import { ContextModule } from 'src/context/context.module';
import { MikroModule } from 'src/mikro/mikro.module';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * Provide shared providers for every feature providers.
 */
@Module({
  imports: [
    ValidationModule.forFeature(),
    ContextModule.forFeature(),
    MikroModule.forFeature(),
  ],
  exports: [ValidationModule, ContextModule, MikroModule],
})
export class SharedModule {}
