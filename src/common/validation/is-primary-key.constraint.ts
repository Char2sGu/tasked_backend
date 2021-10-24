import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { IsPrimaryKey } from './is-primary-key.decorator';
import { ValidationArguments } from './validation-arguments.interface';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPrimaryKeyConstraint implements ValidatorConstraintInterface {
  private em: EntityManager;

  async validate(
    primaryKey: string | number,
    {
      constraints: [entity],
    }: ValidationArguments<Parameters<typeof IsPrimaryKey>>,
  ) {
    return !!(await this.em.findOne(entity(), primaryKey));
  }
}
