import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MikroModule } from 'src/mikro/mikro.module';

/**
 * Provide core providers and should only be imported in the {@link AppModule}.
 */
@Module({
  imports: [
    MikroModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  providers: [],
})
export class CoreModule {}
