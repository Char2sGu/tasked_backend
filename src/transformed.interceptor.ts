import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralEntity } from './general.entity';

@Injectable()
export class TransformedInterceptor implements NestInterceptor {
  constructor(
    readonly entityClass: { new (...args: any[]): any },
    readonly maxDepth = 0,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((ret) => {
        const result = this.mapEntities(ret, (entity) =>
          plainToClass(this.entityClass, entity),
        );
        return result;
      }),
    );
  }

  mapEntities(value: unknown, callback: (entity: GeneralEntity) => unknown) {
    type DataObj = unknown[] | Record<string, unknown>;

    function isDataObj(v: unknown): v is DataObj {
      return (
        typeof v == 'object' &&
        v &&
        [Array, Object].includes(v.constructor as any)
      );
    }

    const search = (value: unknown, curDepth = 0) => {
      if (curDepth > this.maxDepth) return value;

      if (!isDataObj(value))
        return value instanceof GeneralEntity ? callback(value) : value;

      Object.entries(value).forEach(([k, v]) => {
        value[k] = search(v, curDepth + 1);
      });
      return value;
    };

    return search(value);
  }
}
