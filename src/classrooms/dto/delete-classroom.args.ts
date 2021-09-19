import { ArgsType } from '@nestjs/graphql';
import { DeleteOneArgs } from 'src/common/dto/delete-one.args';

@ArgsType()
export class DeleteClassroomArgs extends DeleteOneArgs {}
