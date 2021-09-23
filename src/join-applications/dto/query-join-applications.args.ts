import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/pagination.args';

@ArgsType()
export class QueryJoinApplicationsArgs extends PaginationArgs {}
