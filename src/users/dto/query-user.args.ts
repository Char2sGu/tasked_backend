import { ArgsType } from '@nestjs/graphql';
import { QueryOneArgs } from 'src/common/dto/query-one.args';

@ArgsType()
export class QueryUserArgs extends QueryOneArgs {}