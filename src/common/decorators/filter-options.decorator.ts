import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';

export const FilterOptions = createParamDecorator<never, ExecutionContext>(
  (_, context) => {
    const user =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req.user;
    return user ? { visible: { user } } : false;
  },
);
