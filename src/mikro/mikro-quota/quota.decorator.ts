import { AnyEntity, Collection } from '@mikro-orm/core';

import { QUOTA } from './quota.symbol';

export const Quota =
  (quota: number) =>
  <Entity extends AnyEntity>(
    prototype: Entity,
    field: CollectionField<Entity>,
  ) =>
    Reflect.defineMetadata(QUOTA, quota, prototype, field);

type CollectionField<Entity> = {
  [Field in keyof Entity]: Entity[Field] extends Collection<any>
    ? Field
    : never;
}[Extract<keyof Entity, string>];
