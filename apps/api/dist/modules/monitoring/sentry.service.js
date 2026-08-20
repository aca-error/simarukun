"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SentryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const Sentry = __importStar(require("@sentry/node"));
const node_1 = require("@sentry/node");
const config_1 = require("@nestjs/config");
let SentryService = SentryService_1 = class SentryService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SentryService_1.name);
    }
    onModuleInit() {
        this.initializeSentry();
    }
    initializeSentry() {
        const dsn = this.configService.get('SENTRY_DSN');
        const environment = this.configService.get('NODE_ENV') || 'development';
        const release = this.configService.get('RELEASE_VERSION') || '1.0.0';
        if (!dsn) {
            this.logger.warn('SENTRY_DSN is not configured. Sentry will not be initialized.');
            return;
        }
        Sentry.init({
            dsn,
            tracesSampleRate: 1.0,
            environment,
            release,
            integrations: [
                new node_1.Integrations.Http({ tracing: true }),
                new node_1.Integrations.Express(),
            ],
            beforeSend(event) {
                event.tags = {
                    ...event.tags,
                    app: 'simarukun-api',
                    environment,
                    release,
                };
                return event;
            },
        });
        this.logger.log('Sentry initialized successfully');
    }
    captureException(error, context) {
        Sentry.captureException(error, context);
    }
    captureMessage(message, level = 'error', context) {
        Sentry.captureMessage(message, {
            level: this.mapSeverity(level),
            ...(context ? { extra: context } : {}),
        });
    }
    startTransaction(name, options) {
        return Sentry.startSpan({ name, ...options }, (span) => span);
    }
    setUser(user) {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.email,
            role: user.role,
        });
    }
    setContext(key, value) {
        Sentry.setContext(key, value);
    }
    setTags(tags) {
        Sentry.setTags(tags);
    }
    clearContext() {
        Sentry.getIsolationScope().clear();
    }
    async flush(timeout) {
        return Sentry.flush(timeout);
    }
    async close(timeout) {
        return Sentry.close(timeout);
    }
    mapSeverity(level) {
        const severityMap = {
            debug: 'debug',
            info: 'info',
            warning: 'warning',
            error: 'error',
            fatal: 'fatal',
        };
        return severityMap[level] || 'error';
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = SentryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SentryService);
//# sourceMappingURL=sentry.service.js.map