import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram, Summary } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    public readonly httpRequestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    public readonly httpRequestDuration: Histogram<string>,
    @InjectMetric('http_errors_total')
    public readonly httpErrorsTotal: Counter<string>,
    @InjectMetric('active_connections')
    public readonly activeConnections: Gauge<string>,
    @InjectMetric('http_request_size_bytes')
    public readonly httpRequestSize: Summary<string>,
    @InjectMetric('http_response_size_bytes')
    public readonly httpResponseSize: Summary<string>,
    @InjectMetric('db_query_duration_seconds')
    public readonly dbQueryDuration: Histogram<string>,
    @InjectMetric('db_errors_total')
    public readonly dbErrorsTotal: Counter<string>,
  ) {}

  /**
   * Record HTTP request metrics
   */
  incrementHttpRequests(method: string, status: string, path: string) {
    this.httpRequestsTotal.inc({
      method,
      status,
      path,
    });
  }

  /**
   * Record HTTP request duration
   */
  observeHttpDuration(method: string, path: string, duration: number) {
    this.httpRequestDuration.observe(
      {
        method,
        path,
      },
      duration,
    );
  }

  /**
   * Record HTTP error
   */
  incrementHttpErrors(method: string, status: string, path: string) {
    this.httpErrorsTotal.inc({
      method,
      status,
      path,
    });
  }

  /**
   * Set active connections count
   */
  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  /**
   * Increment active connections
   */
  incrementActiveConnections() {
    this.activeConnections.inc();
  }

  /**
   * Decrement active connections
   */
  decrementActiveConnections() {
    this.activeConnections.dec();
  }

  /**
   * Record request size
   */
  observeRequestSize(method: string, path: string, size: number) {
    this.httpRequestSize.observe(
      {
        method,
        path,
      },
      size,
    );
  }

  /**
   * Record response size
   */
  observeResponseSize(method: string, path: string, size: number) {
    this.httpResponseSize.observe(
      {
        method,
        path,
      },
      size,
    );
  }

  /**
   * Record database query duration
   */
  observeDbQueryDuration(query: string, duration: number) {
    this.dbQueryDuration.observe(
      {
        query,
      },
      duration,
    );
  }

  /**
   * Record database error
   */
  incrementDbErrors(query: string, errorType: string) {
    this.dbErrorsTotal.inc({
      query,
      errorType,
    });
  }
}
