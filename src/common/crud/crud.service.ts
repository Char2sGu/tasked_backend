import {
  CountOptions,
  EntityData,
  FilterQuery,
  FindOneOptions as FindOneOptionsBase,
  FindOneOrFailOptions,
  FindOptions,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException, Type } from '@nestjs/common';

import { BaseEntity } from '../base-entity.entity';

/**
 * A factory class to build common CRUD services.
 */
export abstract class CrudService<Entity> {
  static of<Entity>(type: Type<Entity>): Type<CrudService<Entity>> {
    class Service extends CrudService<Entity> {
      @InjectRepository(type)
      repo: EntityRepository<Entity>;
    }
    return Service;
  }

  protected readonly repo: EntityRepository<Entity>;

  async list(where: FilterQuery<Entity>, options?: FindOptions<Entity>) {
    const results = await this.repo.find(where, options);
    const total = await this.count(where, options);
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
    this.repo.remove(entity);
    return entity;
  }

  async count(where?: FilterQuery<Entity>, options?: CountOptions<Entity>) {
    return this.repo.count(where, options);
  }
}

interface FindOneOptions<Entity, Population extends string>
  extends FindOneOptionsBase<Entity, Population> {
  failHandler?: FindOneOrFailOptions<Entity>['failHandler'] | false;
}
