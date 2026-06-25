import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController extends PrometheusController {
  constructor(private readonly metricsService: MetricsService) {
    super();
  }

  @Get()
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }

  @Get('summary')
  async getMetricsSummary() {
    return {
      message: 'Metrics are available at /api/metrics',
      endpoints: {
        prometheus: '/api/metrics',
        health: '/api/health',
      },
      metrics: {
        http_requests_total: 'Total HTTP requests by method, status, and path',
        http_request_duration_seconds: 'HTTP request duration histogram',
        http_errors_total: 'Total HTTP errors by method, status, and path',
        active_connections: 'Current active connections',
        http_request_size_bytes: 'HTTP request size summary',
        http_response_size_bytes: 'HTTP response size summary',
        db_query_duration_seconds: 'Database query duration histogram',
        db_errors_total: 'Total database errors',
      },
    };
  }
}
