import { EntityRepository, wrap } from '@mikro-orm/core';
import { FilterQuery, OperatorMap } from '@mikro-orm/core/dist/typings';
import { DataLoader } from 'src/data-loader/data-loader.class';

export abstract class EntityRefLoader<Entity> extends DataLoader<
  Entity,
  Entity
> {
  protected abstract repo: EntityRepository<Entity>;

  protected async resolve(refs: Entity[]) {
    const meta = wrap(refs[0], true).__meta;
    const primary = meta.primaryKeys[0];
    const keys = refs.map((ref) => ref[primary]);
    const entities: Entity[] = await this.repo.find({
      [primary]: { $in: keys } as OperatorMap<never>,
    } as FilterQuery<Entity>);
    const results = keys.map((key) =>
      entities.find((entity) => entity[primary] == key),
    );
    return results;
  }
}
