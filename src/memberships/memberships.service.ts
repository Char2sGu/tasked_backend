import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService extends CrudService.of(Membership) {}
