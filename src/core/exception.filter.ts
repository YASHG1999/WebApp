import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const errorResponse = {
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception,
    };

    Logger.error(
      `${request.method} ${request.url} ${exception}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(400).json(errorResponse);
  }
}

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
//
//   catch(exception: any, host: ArgumentsHost): void {
//     const { httpAdapter } = this.httpAdapterHost;
//
//     const ctx = host.switchToHttp();
//
//     const nestjsMessage = exception.message;
//
//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//
//     const responseBody = {
//       statusCode: httpStatus,
//       timestamp: new Date().toISOString(),
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//       message: nestjsMessage,
//     };
//
//     httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//   }
// }
