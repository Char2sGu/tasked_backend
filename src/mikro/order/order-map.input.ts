import { Type } from '@nestjs/common';
import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

import { QueryOrder } from './query-order.enum';

@ObjectType()
export class OrderMapInput {
  static for<Entity, Field extends Extract<keyof Entity, string>>(
    type: () => Type<Entity>,
    fields: readonly Field[],
  ) {
    class _OrderMap extends OrderMapInput {}

    fields.forEach((field) => {
      Field(() => QueryOrder)(_OrderMap.prototype, field);
    });
    InputType()(_OrderMap);

    return _OrderMap as Type<unknown> as Type<Record<Field, QueryOrder>>;
  }

  [field: string]: QueryOrder;
}
