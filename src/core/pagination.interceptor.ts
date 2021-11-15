import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((result) =>
          result instanceof Array &&
          result.length == 2 &&
          result[0] instanceof Array &&
          typeof result[1] == 'number'
            ? { total: result[1], results: result[0] }
            : result,
        ),
      );
  }
}
