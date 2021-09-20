import { ArgsType } from '@nestjs/graphql';
import { QueryManyArgs } from 'src/common/dto/query-many.args';

@ArgsType()
export class QueryMembershipsArgs extends QueryManyArgs {}
