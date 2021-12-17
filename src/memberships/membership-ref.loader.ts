import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipRefLoader extends RefLoader<Membership> {
  constructor(
    @InjectRepository(Membership) protected repo: Repository<Membership>,
  ) {
    super();
  }
}
