import { ArgsType } from '@nestjs/graphql';
import { WithId } from 'src/common/dto/with-id.args';

@ArgsType()
export class AcceptApplicationArgs extends WithId {}
