import {
  AnyEntity,
  EntityManager,
  EntityName,
  FilterQuery,
} from '@mikro-orm/core';
import { OperatorMap } from '@mikro-orm/core/dist/typings';
import DataLoader from 'dataloader';

export class MikroRefLoaderDataLoader<
  Entity extends AnyEntity<Entity>,
  Primary extends keyof Entity,
> extends DataLoader<Entity[Primary], Entity> {
  constructor(em: EntityManager, type: EntityName<Entity>, primary: Primary) {
    super(async (keys) => {
      const entities: Entity[] = await em.find(type, {
        [primary]: { $in: keys } as OperatorMap<never>,
      } as FilterQuery<Entity>);
      const results = keys.map((key) =>
        entities.find((entity) => entity[primary] == key),
      );
      return results;
    });
  }
}
