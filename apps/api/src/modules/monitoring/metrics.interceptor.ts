import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    const path = request.url;
    const startTime = Date.now();

    // Increment active connections
    this.metricsService.incrementActiveConnections();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Record metrics
        this.metricsService.incrementHttpRequests(method, statusCode.toString(), path);
        this.metricsService.observeHttpDuration(method, path, duration / 1000);
        this.metricsService.observeResponseSize(method, path, JSON.stringify(data).length);

        // Decrement active connections
        this.metricsService.decrementActiveConnections();
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Record error metrics
        this.metricsService.incrementHttpRequests(method, statusCode.toString(), path);
        this.metricsService.incrementHttpErrors(method, statusCode.toString(), path);
        this.metricsService.observeHttpDuration(method, path, duration / 1000);

        // Decrement active connections
        this.metricsService.decrementActiveConnections();

        return throwError(() => error);
      }),
    );
  }
}
