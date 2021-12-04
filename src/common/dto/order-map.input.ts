import { QueryOrder } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

registerEnumType(QueryOrder, { name: 'QueryOrder' });

@ObjectType()
export class OrderMap {
  static for<Entity, Field extends Extract<keyof Entity, string>>(
    type: () => Type<Entity>,
    fields: readonly Field[],
  ) {
    class _OrderMap extends OrderMap {}

    fields.forEach((field) => {
      Field(() => QueryOrder)(_OrderMap.prototype, field);
    });
    InputType()(_OrderMap);

    return _OrderMap as Type<unknown> as Type<Record<Field, QueryOrder>>;
  }

  [field: string]: QueryOrder;
}
