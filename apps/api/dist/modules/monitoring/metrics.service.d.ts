import { Counter, Gauge, Histogram, Summary } from 'prom-client';
export declare class MetricsService {
    readonly httpRequestsTotal: Counter<string>;
    readonly httpRequestDuration: Histogram<string>;
    readonly httpErrorsTotal: Counter<string>;
    readonly activeConnections: Gauge<string>;
    readonly httpRequestSize: Summary<string>;
    readonly httpResponseSize: Summary<string>;
    readonly dbQueryDuration: Histogram<string>;
    readonly dbErrorsTotal: Counter<string>;
    constructor(httpRequestsTotal: Counter<string>, httpRequestDuration: Histogram<string>, httpErrorsTotal: Counter<string>, activeConnections: Gauge<string>, httpRequestSize: Summary<string>, httpResponseSize: Summary<string>, dbQueryDuration: Histogram<string>, dbErrorsTotal: Counter<string>);
    incrementHttpRequests(method: string, status: string, path: string): void;
    observeHttpDuration(method: string, path: string, duration: number): void;
    incrementHttpErrors(method: string, status: string, path: string): void;
    setActiveConnections(count: number): void;
    incrementActiveConnections(): void;
    decrementActiveConnections(): void;
    observeRequestSize(method: string, path: string, size: number): void;
    observeResponseSize(method: string, path: string, size: number): void;
    observeDbQueryDuration(query: string, duration: number): void;
    incrementDbErrors(query: string, errorType: string): void;
}
