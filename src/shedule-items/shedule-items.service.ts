import { Injectable } from '@nestjs/common';
import { MikroCrudServiceFactory } from 'nest-mikro-crud';
import { CreateSheduleItemDto } from './dto/create-shedule-item.dto';
import { UpdateSheduleItemDto } from './dto/update-shedule-item.dto';
import { SheduleItem } from './entities/shedule-item.entity';

@Injectable()
export class SheduleItemsService extends new MikroCrudServiceFactory({
  entityClass: SheduleItem,
  dtoClasses: { create: CreateSheduleItemDto, update: UpdateSheduleItemDto },
}).product {}
