import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud/crud.service';

import { JoinApplication } from './entities/join-application.entity';

@Injectable()
export class JoinApplicationsService extends CrudService.of(JoinApplication) {}
