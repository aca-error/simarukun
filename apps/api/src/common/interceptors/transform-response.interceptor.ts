import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types';

/**
 * Transform response to standardized format
 */
@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: this.getMessageFromContext(context),
        timestamp: new Date().toISOString(),
      })),
    );
  }

  /**
   * Get success message based on HTTP method and path
   */
  private getMessageFromContext(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.url;

    // Custom messages based on operation
    if (method === 'POST') {
      return 'Resource created successfully';
    } else if (method === 'PUT' || method === 'PATCH') {
      return 'Resource updated successfully';
    } else if (method === 'DELETE') {
      return 'Resource deleted successfully';
    }

    return undefined;
  }
}
