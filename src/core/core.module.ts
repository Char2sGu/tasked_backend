import { Module } from '@nestjs/common';
import { ContextModule } from 'src/context/context.module';
import { COMPLEXITY, THROTTLER_LIMIT, THROTTLER_TTL } from 'src/env.constants';
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
    GraphqlModule.forRoot(COMPLEXITY),
    ValidationModule.forRoot(),
    ThrottlerModule.forRoot(THROTTLER_TTL, THROTTLER_LIMIT),
  ],
})
export class CoreModule {}
