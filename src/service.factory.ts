import { LookupFields, QueryDto, RestServiceFactory } from 'nest-restful';
import { ListResponse } from './list-response.interface';

export class ServiceFactory<
  Entity = any,
  CreateDto = Entity,
  UpdateDto = CreateDto,
  LookupField extends LookupFields<Entity> = LookupFields<Entity>,
  CustomArgs extends any[] = any[]
> extends RestServiceFactory<
  Entity,
  CreateDto,
  UpdateDto,
  LookupField,
  CustomArgs
> {
  protected createRawClass() {
    return class Service extends super.createRawClass() {
      async finalizeList(
        entities: Entity[],
        queries: QueryDto<Entity>,
        ...args: CustomArgs
      ) {
        const total = await this.repository.count({
          where: await this.getQueryConditions(undefined, ...args),
        });
        const ret: ListResponse<Entity> = { total, results: entities };
        return ret;
      }
    };
  }
}
