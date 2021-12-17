import { InjectRepository } from '@mikro-orm/nestjs';
import { RefLoader } from 'src/common/ref-loader.class';
import { Repository } from 'src/mikro/repository.class';

import { User } from './entities/user.entity';

export class UserRefLoader extends RefLoader<User> {
  constructor(@InjectRepository(User) protected repo: Repository<User>) {
    super();
  }
}
