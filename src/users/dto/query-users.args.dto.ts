import { ArgsType } from '@nestjs/graphql';
import { WithPagination } from 'src/common/dto/with-pagination.args.dto';

@ArgsType()
export class QueryUsersArgs extends WithPagination {}
