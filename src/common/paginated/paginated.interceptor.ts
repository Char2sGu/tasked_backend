import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class PaginatedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<[number, unknown[]]>) {
    return next.handle().pipe(map(([total, results]) => ({ total, results })));
  }
}
