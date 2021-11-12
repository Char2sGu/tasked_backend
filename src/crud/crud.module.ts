import { AnyEntity, EntityName, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Inject, Module } from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';

@Module({})
export class CrudModule {
  static forFeature(entity: EntityName<AnyEntity>): DynamicModule {
    class CrudServiceConfigured extends CrudService<never> {
      @Inject() repo: EntityRepository<never>;
    }

    return {
      module: CrudModule,
      imports: [MikroOrmModule.forFeature([entity])],
      providers: [
        {
          provide: EntityRepository,
          useExisting: getRepositoryToken(entity),
        },
        {
          provide: CrudService,
          useClass: CrudServiceConfigured,
        },
      ],
      exports: [MikroOrmModule, EntityRepository, CrudService],
    };
  }
}
