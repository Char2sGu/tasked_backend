import {
  EntityData,
  FilterQuery,
  FindOneOptions as FindOneOptionsBase,
  FindOneOrFailOptions,
  FindOptions,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { BaseEntity } from '../common/base-entity.entity';
import { CrudModuleOptions } from './crud-module-options.class';

/**
 * A factory class to build common CRUD services.
 */
@Injectable()
export class CrudService<Entity> {
  constructor(
    public repo: EntityRepository<Entity>,
    private options: CrudModuleOptions<Entity>,
  ) {}

  async list<Population extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOptions<Entity, Population>,
  ) {
    const [results, total] = await this.repo.findAndCount(where, options);
    return { total, results };
  }

  async create(data: EntityData<Entity>) {
    const entity = this.repo.create(data);
    this.repo.persist(entity);
    return entity;
  }

  async retrieve<Population extends string = never>(
    where: FilterQuery<Entity> | Entity,
    options?: FindOneOptions<Entity, Population>,
  ) {
    if (where instanceof BaseEntity) return where as Entity;
    return options?.failHandler == false
      ? this.repo.findOne(where, { ...options })
      : this.repo.findOneOrFail(where, {
          ...options,
          failHandler: options?.failHandler ?? (() => new NotFoundException()),
        });
  }

  async update<Population extends string = never>(
    where: FilterQuery<Entity> | Entity,
    data: EntityData<Entity>,
    options?: FindOneOptions<Entity, Population>,
  ) {
    const entity = await this.retrieve(where, options);
    this.repo.assign(entity, data);
    return entity;
  }

  async destroy<Population extends string = never>(
    where: FilterQuery<Entity> | Entity,
    options?: FindOneOptions<Entity, Population>,
  ) {
    const entity = await this.retrieve(where, options);
    if (this.options?.soft) entity[this.options.soft] = new Date() as any;
    else this.repo.remove(entity);
    return entity;
  }
}

interface FindOneOptions<Entity, Population extends string>
  extends FindOneOptionsBase<Entity, Population> {
  failHandler?: FindOneOrFailOptions<Entity>['failHandler'] | false;
}
