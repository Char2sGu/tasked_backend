import { ArgsType } from '@nestjs/graphql';
import { HasDataArgs } from 'src/common/dto/has-data.args';

import { AffairCreateInput } from './affair-create.input';

@ArgsType()
export class CreateAffairArgs extends HasDataArgs.for(AffairCreateInput) {}
