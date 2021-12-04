import { Type } from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';
import { Field } from 'src/common/field.decorator';

@ArgsType()
export class WithOrder<Order> {
  static for<Order>(type: () => Type<Order>): Type<WithOrder<Order>> {
    @ArgsType()
    class WithOrder_ extends WithOrder<Order> {
      @Field(() => type(), { nullable: true, nested: true })
      order?: any;
    }
    return WithOrder_;
  }

  order?: Order;
}
