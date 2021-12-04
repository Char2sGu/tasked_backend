import { AnyEntity, QueryOrderNumeric } from '@mikro-orm/core';
import { Type } from '@nestjs/common';
import { InputType, registerEnumType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

import { ORDERABLE } from './orderable.decorator';

registerEnumType(QueryOrderNumeric, { name: 'QueryOrder' });

@InputType()
export class OrderMap {
  static for<Entity, Field extends Extract<keyof Entity, string>>(
    type: () => Type<Entity>,
    fields: readonly Field[],
  ) {
    class _OrderMap extends this {}

    fields.forEach((field) => {
      Field(() => QueryOrderNumeric, { nullable: true })(
        _OrderMap.prototype,
        field,
      );
    });
    InputType()(_OrderMap);

    return _OrderMap as Type<unknown> as Type<Record<Field, QueryOrderNumeric>>;
  }

  static from(type: Type<AnyEntity>) {
    const fields: Set<string> = Reflect.getMetadata(ORDERABLE, type);
    return this.for(() => type, [...fields]);
  }

  [field: string]: QueryOrderNumeric;
}
