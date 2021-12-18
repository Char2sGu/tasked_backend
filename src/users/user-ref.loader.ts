import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRefLoader } from 'src/common/entity-ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { User } from './entities/user.entity';

export class UserRefLoader extends EntityRefLoader<User> {
  constructor(@InjectRepository(User) protected repo: Repository<User>) {
    super();
  }
}
