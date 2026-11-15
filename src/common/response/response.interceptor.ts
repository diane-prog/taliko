import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';

const RESPONSE_ENVELOPE_BYPASS_PATHS = [
  '/ping',
  '/docs',
  '/docs-json',
  '/docs/redoc',
] as const;

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Wraps successful HTTP responses in the standard API envelope `{ statusCode, data }`
   * unless the route must stay raw.
   *
   * @param context - Nest execution context
   * @param next - Next handler
   * @returns Observable of enveloped response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    if (this.shouldBypassResponseEnvelope(request)) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  /**
   * Determines whether a route must bypass the response wrapper.
   */
  private shouldBypassResponseEnvelope(request: Request): boolean {
    const requestPath =
      (request as any).route?.path ?? request.path ?? request.url.split('?')[0];

    return RESPONSE_ENVELOPE_BYPASS_PATHS.some(
      (bypassPath) =>
        requestPath === bypassPath || requestPath.startsWith(`${bypassPath}/`),
    );
  }

  /**
   * Builds the standard API success envelope.
   */
  responseHandler(res: unknown, context: ExecutionContext): unknown {
    const response = context.switchToHttp().getResponse();

    return {
      statusCode: response.statusCode,
      data: res,
    };
  }
}
