import { Type } from '@nestjs/common';

import { SOFT_DELETABLE } from './soft-deletable.symbol';

export const SoftDeletable =
  <Entity>(field: SoftDeletableField<Entity>) =>
  (type: Type<Entity>) =>
    Reflect.defineMetadata(SOFT_DELETABLE, field, type);

type SoftDeletableField<Entity> = {
  [Field in keyof Entity]: Date extends Entity[Field] ? Field : never;
}[keyof Entity];
