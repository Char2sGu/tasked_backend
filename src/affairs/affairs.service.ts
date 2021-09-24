import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Affair } from './entities/affair.entity';

@Injectable()
export class AffairsService extends CrudService.of(Affair) {}
