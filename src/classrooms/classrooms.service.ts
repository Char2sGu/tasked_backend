import { FilterQuery, FindOneOrFailOptions } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService extends CrudService.of(Classroom) {
  async destroy(
    where: FilterQuery<Classroom>,
    options?: FindOneOrFailOptions<Classroom>,
  ) {
    const entity = await this.retrieve(where, options);
    entity.deletedAt = new Date();
    return entity;
  }
}
