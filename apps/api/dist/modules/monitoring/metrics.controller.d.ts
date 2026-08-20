import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Response } from 'express';
import { MetricsService } from './metrics.service';
export declare class MetricsController extends PrometheusController {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    index(response: Response): Promise<string>;
    getMetricsSummary(): Promise<{
        message: string;
        endpoints: {
            prometheus: string;
            health: string;
        };
        metrics: {
            http_requests_total: string;
            http_request_duration_seconds: string;
            http_errors_total: string;
            active_connections: string;
            http_request_size_bytes: string;
            http_response_size_bytes: string;
            db_query_duration_seconds: string;
            db_errors_total: string;
        };
    }>;
}
