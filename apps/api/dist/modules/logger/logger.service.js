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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston = __importStar(require("winston"));
let LoggerService = class LoggerService extends common_1.ConsoleLogger {
    constructor(context, configService) {
        super(context);
        this.configService = configService;
        this.loggerContext = context;
        this.winstonLogger = winston.createLogger({
            level: this.configService.get('LOG_LEVEL') || 'info',
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
                        const contextStr = context ? `[${context}]` : '';
                        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
                        return `${timestamp} [${level}] ${contextStr} ${message}${metaStr}`;
                    })),
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                }),
            ],
            exitOnError: false,
        });
    }
    log(message, context, meta) {
        this.winstonLogger.info({
            message,
            context: context || this.loggerContext,
            ...meta,
        });
        super.log(message, context);
    }
    error(message, trace, context, meta) {
        this.winstonLogger.error({
            message,
            context: context || this.loggerContext,
            trace,
            ...meta,
        });
        super.error(message, trace, context);
    }
    warn(message, context, meta) {
        this.winstonLogger.warn({
            message,
            context: context || this.loggerContext,
            ...meta,
        });
        super.warn(message, context);
    }
    debug(message, context, meta) {
        this.winstonLogger.debug({
            message,
            context: context || this.loggerContext,
            ...meta,
        });
        super.debug(message, context);
    }
    verbose(message, context, meta) {
        this.winstonLogger.verbose({
            message,
            context: context || this.loggerContext,
            ...meta,
        });
        super.verbose(message, context);
    }
    custom(level, message, context, meta) {
        this.winstonLogger.log(level, message, {
            context: context || this.loggerContext,
            ...meta,
        });
    }
    logRequest(method, path, statusCode, duration, userId, ip, userAgent) {
        this.winstonLogger.info({
            message: 'HTTP Request',
            context: 'HTTP',
            method,
            path,
            statusCode,
            duration,
            userId,
            ip,
            userAgent,
        });
    }
    logError(method, path, statusCode, error, userId, ip, userAgent) {
        this.winstonLogger.error({
            message: 'HTTP Error',
            context: 'HTTP',
            method,
            path,
            statusCode,
            error: error.message,
            stack: error.stack,
            userId,
            ip,
            userAgent,
        });
    }
    logQuery(query, params, duration, error) {
        if (error) {
            this.winstonLogger.error({
                message: 'Database Query Error',
                context: 'Database',
                query,
                params,
                duration,
                error: error.message,
                stack: error.stack,
            });
        }
        else {
            this.winstonLogger.debug({
                message: 'Database Query',
                context: 'Database',
                query,
                params,
                duration,
            });
        }
    }
    logAuth(action, userId, email, success, ip, userAgent, error) {
        const level = success ? 'info' : 'warn';
        this.winstonLogger.log(level, {
            message: `Authentication ${action}`,
            context: 'Auth',
            action,
            userId,
            email,
            success,
            ip,
            userAgent,
            error,
        });
    }
    logAudit(action, userId, entity, entityId, metadata, ip, userAgent) {
        this.winstonLogger.info({
            message: 'Audit Log',
            context: 'Audit',
            action,
            userId,
            entity,
            entityId,
            metadata,
            ip,
            userAgent,
        });
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String, config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map