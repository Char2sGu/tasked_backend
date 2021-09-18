import {
  EntityData,
  FilterQuery,
  FindOneOrFailOptions,
  FindOptions,
  NotFoundError,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Type } from '@nestjs/common';

export abstract class CrudService<Entity> {
  static of<Entity>(type: Type<Entity>): Type<CrudService<Entity>> {
    class Service extends CrudService<Entity> {
      @InjectRepository(type)
      repo: EntityRepository<Entity>;
    }
    return Service;
  }

  protected readonly repo: EntityRepository<Entity>;

  async list(where: FilterQuery<Entity>, options: FindOptions<Entity>) {
    options = this.preprocessOptions(options);
    const [results, total] = await this.repo.findAndCount(where, options);
    return { total, results };
  }

  async create(data: EntityData<Entity>) {
    const entity = this.repo.create(data);
    this.repo.persist(entity);
    return entity;
  }

  async retrieve(
    where: FilterQuery<Entity>,
    options?: FindOneOrFailOptions<Entity>,
  ) {
    options = this.preprocessOptions(options);
    return await this.repo.findOneOrFail(where, options);
  }

  async update(
    where: FilterQuery<Entity>,
    data: EntityData<Entity>,
    options: FindOneOrFailOptions<Entity>,
  ) {
    const entity = await this.retrieve(where, options);
    this.repo.assign(entity, data);
    return entity;
  }

  async destroy(
    where: FilterQuery<Entity>,
    options: FindOneOrFailOptions<Entity>,
  ) {
    const entity = await this.retrieve(where, options);
    this.repo.remove(entity);
    return entity;
  }

  async exists(
    where: FilterQuery<Entity>,
    options: FindOneOrFailOptions<Entity>,
  ) {
    try {
      await this.retrieve(where, options);
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) return false;
      throw error;
    }
  }

  protected preprocessOptions(
    options: FindOptions<Entity>,
  ): FindOptions<Entity> {
    return options;
  }
}