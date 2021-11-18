import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ContextModule } from 'src/context/context.module';
import { MikroModule } from 'src/mikro/mikro.module';
import { ValidationModule } from 'src/validation/validation.module';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
@Module({
  imports: [
    ContextModule.forRoot(),
    MikroModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    ValidationModule.forRoot(),
  ],
  providers: [],
})
export class CoreModule {}
