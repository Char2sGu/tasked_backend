import { Module } from '@nestjs/common';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  providers: [ValidationModule],
  exports: [ValidationModule],
})
export class SharedModule {}
