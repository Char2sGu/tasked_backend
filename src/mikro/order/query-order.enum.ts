import { QueryOrder } from '@mikro-orm/core';
import { registerEnumType } from '@nestjs/graphql';

export { QueryOrder };

registerEnumType(QueryOrder, { name: 'QueryOrder' });
