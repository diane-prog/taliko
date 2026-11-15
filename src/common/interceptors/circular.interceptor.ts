import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parse, stringify } from 'flatted';

@Injectable()
export class CircularInterceptor implements NestInterceptor {
  /**
   * Serializes responses safely to protect against circular JSON structures.
   */
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined || data === null) {
          return data;
        }
        const safeJson = stringify(data);
        return parse(safeJson);
      }),
    );
  }
}
