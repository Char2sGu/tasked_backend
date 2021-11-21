import DataLoader from 'dataloader';

import { BaseEntity } from '../base-entity.entity';

export type MikroBatchDataLoader<Entity extends BaseEntity<Entity>> =
  DataLoader<Entity, Entity>;
