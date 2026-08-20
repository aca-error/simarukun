import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): Promise<import("./health.service").HealthCheckResult>;
    checkDetailed(): Promise<import("./health.service").HealthCheckResult>;
    checkDb(): Promise<import("./health.service").HealthCheckResult>;
    checkRedis(): Promise<import("./health.service").HealthCheckResult>;
}
