import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class MikroFiltersModule {
  static forRoot(): DynamicModule {
    return {
      module: MikroFiltersModule,
      providers: [],
    };
  }
}
