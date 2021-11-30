import {
  EntityData,
  EntityRepository,
  FilterQuery,
  FindOptions,
  Loaded,
  New,
} from '@mikro-orm/core';

export class Repository<Entity> extends EntityRepository<Entity> {
  /**
   * Replace the return value of {@link EntityRepository.findAndCount} with an
   * object.
   * @param where
   * @param options
   * @returns
   */
  async findAndPaginate<Populate extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOptions<Entity, Populate>,
  ): Promise<{ total: number; results: Loaded<Entity, Populate>[] }> {
    const [results, total] = await super.findAndCount(where, options);
    return { total, results };
  }

  /**
   * Persist the created entity by default.
   * @param data
   * @param persist
   * @returns
   */
  create<Populate extends string = any>(
    data: EntityData<Entity>,
    persist = true,
  ): New<Entity, Populate> {
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
