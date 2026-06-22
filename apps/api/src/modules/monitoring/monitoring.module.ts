import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { SentryService } from './sentry.service';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/api/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'simarukun_',
          labelDecorator: (labels: Record<string, string>) => {
            labels.instance = process.env.HOSTNAME || 'localhost';
            labels.environment = process.env.NODE_ENV || 'development';
            return labels;
          },
        },
      },
    }),
  ],
  controllers: [MetricsController],
  providers: [MetricsService, SentryService],
  exports: [MetricsService, SentryService],
})
export class MonitoringModule {}
