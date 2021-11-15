import { AnyEntity, EntityName, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { CrudService } from 'src/crud/crud.service';

import { CrudModuleOptions } from './crud-module-options.class';

@Module({})
export class CrudModule {
  static forFeature<Entity>(
    entity: EntityName<Entity>,
    options: CrudModuleOptions<Entity> = {},
  ): DynamicModule {
    return {
      module: CrudModule,
      imports: [MikroOrmModule.forFeature([entity as EntityName<AnyEntity>])],
      providers: [
        {
          provide: EntityRepository,
          useExisting: getRepositoryToken(entity),
        },
        {
          provide: CrudModuleOptions,
          useValue: options,
        },
        CrudService,
      ],
      exports: [MikroOrmModule, EntityRepository, CrudService],
    };
  }
}
