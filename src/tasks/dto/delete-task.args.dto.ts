import { ArgsType } from '@nestjs/graphql';
import { WithId } from 'src/common/dto/with-id.args.dto';

@ArgsType()
export class DeleteTaskArgs extends WithId {}
