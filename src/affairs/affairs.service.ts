import { EntityData } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Affair } from './entities/affair.entity';

@Injectable()
export class AffairsService extends CrudService.of(Affair) {
  validate(data: EntityData<Affair>) {
    if (!data.timeStart || !data.timeEnd) return;
    if (data.timeEnd <= data.timeStart)
      throw new BadRequestException(
        'The start time must be earlier than the end time',
      );
  }
}
