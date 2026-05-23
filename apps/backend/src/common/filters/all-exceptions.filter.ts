import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { ApiError, ApiFailure } from '@insights/contracts';
import { Response } from 'express';

const HTTP_ERROR_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ApiFailure = {
      error: {
        code: HTTP_ERROR_CODES[status] ?? 'INTERNAL_ERROR',
        ...this.resolveError(exception),
      },
    };

    response.status(status).json(body);
  }

  private resolveError(exception: unknown): Pick<ApiError, 'message' | 'details'> {
    if (!(exception instanceof HttpException)) {
      return { message: 'Internal server error' };
    }

    const res = exception.getResponse();

    if (typeof res === 'string') return { message: res };

    const { message } = res as { message: string | string[] };

    if (Array.isArray(message)) {
      return { message: 'Validation failed', details: { _: message } };
    }

    return { message: message ?? exception.message };
  }
}
