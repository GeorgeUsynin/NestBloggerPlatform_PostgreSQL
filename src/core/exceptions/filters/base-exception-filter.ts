import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException, ErrorsMessages } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

export type HttpResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  code: DomainExceptionCode | null;
  errorsMessages: ErrorsMessages[];
};

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(url: string, exception: unknown): HttpResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: url,
      message: (exception as any).message || 'Internal server error',
      code: exception instanceof DomainException ? exception.code : null,
      errorsMessages:
        exception instanceof DomainException ? exception.errorsMessages : [],
    };
  }
}
