import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { SentryService } from './sentry.service';
import { MetricsInterceptor } from './metrics.interceptor';

const metricProviders = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total HTTP requests by method, status, and path',
    labelNames: ['method', 'status', 'path'],
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  }),
  makeCounterProvider({
    name: 'http_errors_total',
    help: 'Total HTTP errors by method, status, and path',
    labelNames: ['method', 'status', 'path'],
  }),
  makeGaugeProvider({
    name: 'active_connections',
    help: 'Current active HTTP connections',
  }),
  makeSummaryProvider({
    name: 'http_request_size_bytes',
    help: 'HTTP request size in bytes',
    labelNames: ['method', 'path'],
  }),
  makeSummaryProvider({
    name: 'http_response_size_bytes',
    help: 'HTTP response size in bytes',
    labelNames: ['method', 'path'],
  }),
  makeHistogramProvider({
    name: 'db_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['query'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
  }),
  makeCounterProvider({
    name: 'db_errors_total',
    help: 'Total database errors',
    labelNames: ['query', 'errorType'],
  }),
];

@Module({
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
      path: 'metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'simarukun_',
        },
      },
      defaultLabels: {
        instance: process.env.HOSTNAME || 'localhost',
        environment: process.env.NODE_ENV || 'development',
      },
    }),
  ],
  providers: [...metricProviders, MetricsService, SentryService, MetricsInterceptor],
  exports: [MetricsService, SentryService, MetricsInterceptor],
})
export class MonitoringModule {}
