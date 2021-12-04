import { Module } from '@nestjs/common';
import { ContextModule } from 'src/context/context.module';
import { GraphqlModule } from 'src/graphql/graphql.module';
import { MikroModule } from 'src/mikro/mikro.module';
import { ThrottlerModule } from 'src/throttler/throttler.module';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
@Module({
  imports: [
    ContextModule.forRoot(),
    MikroModule.forRoot(),
    GraphqlModule.forRoot(),
    ValidationModule.forRoot(),
    ThrottlerModule,
  ],
  providers: [],
})
export class CoreModule {}
