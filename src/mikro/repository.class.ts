import {
  EntityData,
  EntityRepository,
  FilterQuery,
  FindOneOptions,
  FindOptions,
  Loaded,
  New,
  Primary,
  Utils,
} from '@mikro-orm/core';

export class Repository<Entity> extends EntityRepository<Entity> {
  /**
   * Replace the return value of {@link EntityRepository.findAndCount} with an
   * object.
   * @param where
   * @param options
   * @returns
   */
  async findAndPaginate<Population extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOptions<Entity, Population>,
  ): Promise<{ total: number; results: Loaded<Entity, Population>[] }> {
    const [results, total] = await super.findAndCount(where, options);
    return { total, results };
  }

  /**
   * Use the Identity Map if possible, and execute a query when the entity is
   * not loaded in the Identity Map.
   * @param id
   * @returns
   */
  async findOneById(id: Primary<Entity>, options?: FindOneOptions<Entity>) {
    const loaded = this.em
      .getUnitOfWork()
      .getById<Entity>(Utils.className(this.entityName), id);
    return loaded ?? this.findOne(id as any, options);
  }

  /**
   * Persist the created entity by default.
   * @param data
   * @param persist
   * @returns
   */
  create<Population extends string = any>(
    data: EntityData<Entity>,
    persist = true,
  ): New<Entity, Population> {
    const result = super.create(data);
    if (persist) this.persist(result);
    return result;
  }

  /**
   * Returns the removed entity rather than `this`.
   * @param entity
   * @returns
   */
  delete(entity: Entity) {
    this.remove(entity);
    return entity;
  }
}
