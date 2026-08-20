import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../types';

/**
 * Global exception filter for standardized error responses
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as any;
        message = resp.message || message;
        error = resp.error || error;
      }
    }

    // Don't log sensitive information in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    const errorResponse: ApiErrorResponse = {
      success: false,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error details in development
    if (isDevelopment) {
      console.error(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
      console.error(`Status: ${statusCode}`);
      console.error(`Error:`, exception);
    }

    response.status(statusCode).json(errorResponse);
  }
}
