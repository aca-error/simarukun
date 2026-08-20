"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const metrics_controller_1 = require("./metrics.controller");
const metrics_service_1 = require("./metrics.service");
const sentry_service_1 = require("./sentry.service");
const metrics_interceptor_1 = require("./metrics.interceptor");
const metricProviders = [
    (0, nestjs_prometheus_1.makeCounterProvider)({
        name: 'http_requests_total',
        help: 'Total HTTP requests by method, status, and path',
        labelNames: ['method', 'status', 'path'],
    }),
    (0, nestjs_prometheus_1.makeHistogramProvider)({
        name: 'http_request_duration_seconds',
        help: 'HTTP request duration in seconds',
        labelNames: ['method', 'path'],
        buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    (0, nestjs_prometheus_1.makeCounterProvider)({
        name: 'http_errors_total',
        help: 'Total HTTP errors by method, status, and path',
        labelNames: ['method', 'status', 'path'],
    }),
    (0, nestjs_prometheus_1.makeGaugeProvider)({
        name: 'active_connections',
        help: 'Current active HTTP connections',
    }),
    (0, nestjs_prometheus_1.makeSummaryProvider)({
        name: 'http_request_size_bytes',
        help: 'HTTP request size in bytes',
        labelNames: ['method', 'path'],
    }),
    (0, nestjs_prometheus_1.makeSummaryProvider)({
        name: 'http_response_size_bytes',
        help: 'HTTP response size in bytes',
        labelNames: ['method', 'path'],
    }),
    (0, nestjs_prometheus_1.makeHistogramProvider)({
        name: 'db_query_duration_seconds',
        help: 'Database query duration in seconds',
        labelNames: ['query'],
        buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2],
    }),
    (0, nestjs_prometheus_1.makeCounterProvider)({
        name: 'db_errors_total',
        help: 'Total database errors',
        labelNames: ['query', 'errorType'],
    }),
];
let MonitoringModule = class MonitoringModule {
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_prometheus_1.PrometheusModule.register({
                controller: metrics_controller_1.MetricsController,
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
        providers: [...metricProviders, metrics_service_1.MetricsService, sentry_service_1.SentryService, metrics_interceptor_1.MetricsInterceptor],
        exports: [metrics_service_1.MetricsService, sentry_service_1.SentryService, metrics_interceptor_1.MetricsInterceptor],
    })
], MonitoringModule);
//# sourceMappingURL=monitoring.module.js.map