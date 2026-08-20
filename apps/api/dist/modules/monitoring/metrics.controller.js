"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const metrics_service_1 = require("./metrics.service");
let MetricsController = class MetricsController extends nestjs_prometheus_1.PrometheusController {
    constructor(metricsService) {
        super();
        this.metricsService = metricsService;
    }
    async index(response) {
        return super.index(response);
    }
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
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "index", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetricsSummary", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)('metrics'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map